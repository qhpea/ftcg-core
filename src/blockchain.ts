type Key = Uint8Array;
import { sha3_256 } from 'js-sha3';
import ohash from 'object-hash';
import nacl from 'tweetnacl';
import { serialize, deserialize, Int32 } from 'bson';

interface UpdateUser {
    //publicKey: PublicKey;
    name: string
    email: string
    website: string
}

interface RegisterScope {
    name: string
}

interface AddUserToScope {
    scope: string
    user: Key
    tier: number
}

interface RemoveUserFromScope {
    scope: string
    user: Key;
}

interface Pay {
    to: Key;
    ammount: BigInt;
}

interface Download {
    content: string;
    provider: Key
}

function pack(secretKey: Key, transaction: Transaction<any>) {
    const stuff = { timestamp: transaction.timestamp, kind: new Int32(transaction.kind), body: transaction.body };
    const from = transaction.from;
    const buffer = serialize(stuff);
    const msg = Uint8Array.from(buffer);
    // const passthrough = ohash(stuff, {algorithm: "passthrough"})
    // return sha3_256.arrayBuffer(passthrough);
    const signedMsg = nacl.sign(msg, secretKey);
    return serialize({ from, signedMsg });
}

function unpack(buffer: Buffer) {
    const { from, signedMsg } = deserialize(buffer);
    const msg = nacl.sign.open(signedMsg, from)
    if (!msg)
        throw new Error("invalid signature");

    return {
        from,
        ...deserialize(msg)
    } as Transaction<any>
}

enum TransactionKind {
    Invalid,
    Share,
    Download,
    ScopeCreate,
    ScopeAddUser,
    ScopeRemoveUser,
    Pay,
    Stake, Validate,
    Reputation, Ban,
}

interface Transaction<T> {
    from: Key;
    timestamp: number,
    kind: TransactionKind;
    body: T;
}