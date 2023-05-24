'use client'

import Image from 'next/image'
import * as fcl from "@onflow/fcl"

fcl.config({
  "app.detail.title": "1-NON-FUNGIBLE-TOKEN", // this adds a custom name to our wallet
  "app.detail.icon": "https://i.imgur.com/ux3lYB9.png", // this adds a custom image to our wallet
  "accessNode.api": "https://rest-testnet.onflow.org", // this is for the local emulator
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // this is for the local dev wallet
  "0xDeployer": "0x8ba928c288f86192", // this auto configures `0xDeployer` to be replaced by the address in txs and scripts
  "0xMetadataViews": "0x631e88ae7f1d7c20"
})

export default function Home() {

  async function txDeleteCollection() {
    const transactionId = await fcl.mutate({
      cadence: `
        import NFTistNFT from 0xDeployer
        import NonFungibleToken from 0xStandard
        import MetadataViews from 0xStandard
  
        transaction() {
          prepare(signer: AuthAccount) {
            destroy signer.load<@NonFungibleToken.Collection>(from: NFTistNFT.CollectionStoragePath)
            signer.unlink(NFTistNFT.CollectionPublicPath)
          }
          execute {  }
        }
      `,
      args: () => [],
      proposer: fcl.authz,
      payer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999
    })
    
    console.log('Transaction Id', transactionId)
  }

  async function txTest() {
    const cadence = `
        import NFTistNFT from 0xDeployer
        import NonFungibleToken from 0xStandard
        import MetadataViews from 0xStandard
  
        transaction() {
          prepare(signer: AuthAccount) {
            // 혹시 이미 존재한다면, 콜렉션 삭제
            destroy signer.load<@NonFungibleToken.Collection>(from: NFTistNFT.CollectionStoragePath)
            signer.unlink(NFTistNFT.CollectionPublicPath)
          }
          execute {  }
        }
      `;
    
    const transactionId = await fcl.send([
      fcl.transaction(cadence),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(999),
      fcl.args([])
    ]).then(fcl.decode);

    console.log('Transaction Id', transactionId)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="mt-4" onClick={()=>{fcl.authenticate()}}>login</div>
        <div className="mt-4" onClick={()=>{txDeleteCollection()}}>mutate</div>
        <div className="mt-4" onClick={()=>{txTest()}}>send</div>
      </div>
    </main>
  )
}
