declare module 'js-stellar-sdk' {
  export interface FreighterApi {
    getPublicKey: () => Promise<string>
    getNetwork: () => Promise<any>
    isConnected: () => Promise<boolean>
    signTransaction: (xdr: string, passphrase: string) => Promise<any>
  }

  export const Keypair: any
  export const TransactionBuilder: any
  export const Operation: any
  export const Asset: any
  export const Server: any
  export const Networks: any
  export const BASE_FEE: string
  export const TESTNET_NETWORK_PASSPHRASE: string
  export const PUBLIC_NETWORK_PASSPHRASE: string
  export default any
}
