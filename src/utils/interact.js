import { ethers } from 'ethers'
import axios from 'axios'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import {
  nftaddress, nftmarketaddress, infuraUrl
} from '../const'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import { userService } from 'services/userService'

export const rpcEndpoint = infuraUrl

export async function getRpcProvider() {
  const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint)
  await provider.ready
  return provider
}

export async function getWeb3Provider() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.ready
  return provider
}

export async function getRpcContracts() {
  const provider = await getRpcProvider()
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
  return { tokenContract, marketContract }
}

export async function getWeb3Contract() {
  const provider = await getWeb3Provider()
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider.getSigner())
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider.getSigner())
  return { tokenContract, marketContract }
}

export async function getNFTs() {
  const { tokenContract, marketContract } = await getRpcContracts();
  const data = await marketContract.fetchMarketItems()
  let profiles = [];

  try {
    const { data } = await userService.list();
    profiles = data.items;
  } catch (e) {
    console.log(e, 'loading profiles error');
  }

  const items = await Promise.all(data.map(async i => {
    const tokenUri = await tokenContract.tokenURI(i.tokenId)
    const meta = await axios.get(tokenUri)
    let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    let item = {
      price,
      itemId: i.itemId.toNumber(),
      seller: i.seller,
      owner: i.owner,
      image: meta.data.image,
      name: meta.data.name,
      description: meta.data.description,
      meta: meta.data,
      sellerProfile: profiles.find(p => p.publicAddress == i.seller)
    }
    return item
  }))
  return items
}

export async function createMarketItem(form) {
  const { title, description, price, edition, creator, image } = form
  console.log(price, 'hoho');
  const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

  // upload image
  const { data: imageFile } = await axios.get(image, { responseType: 'blob' })
  const added = await client.add(imageFile)
  const imageUrl = `https://ipfs.infura.io/ipfs/${added.path}`

  // upload meta data
  const data = JSON.stringify({
    title, creator, edition, description, image: imageUrl
  })
  try {
    const added = await client.add(data)
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
    return await createSale(url, price)
  } catch (error) {
    console.log('Error uploading file: ', error)
  }
}

export async function createSale(metaUrl, price) {
  const { tokenContract, marketContract } = await getWeb3Contract();

  let transaction = await tokenContract.createToken(metaUrl)
  let tx = await transaction.wait()
  let event = tx.events[0]
  let value = event.args[2]
  let tokenId = value.toNumber()

  const itemPrice = ethers.utils.parseUnits(price.toString(), 'ether')

  transaction = await marketContract.createMarketItem(tokenContract.address, tokenId, itemPrice, 15, {
    gasLimit: 250000
  })
  await transaction.wait();
  return tokenId;
}

export async function fetchMe() {
  try {
    const provider = await getWeb3Provider();
    const signer = provider.getSigner();
    const add = await signer.getAddress()
    let bal = await provider.getBalance(add);

    return {
      connected: true,
      publicAddress: add,
      balance: + ethers.utils.formatUnits(bal.toString(), 'ether'),
    }
  } catch (e) {
    console.log(e, 'ON GET ADDRESS');
    return { connected: false, publicAddress: '', balance: 0 }
  };
}
