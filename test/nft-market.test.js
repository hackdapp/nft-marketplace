/* test/nft-market.test.js */
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", async () => {
	let nftMarket
	let nft

	let nftMarketContractAddr
	let nftContractAddr

  beforeEach(async () => {
		/* deploy the NFT Market contract */
		const NFTMarket = await ethers.getContractFactory("NFTMarket")
		nftMarket = await NFTMarket.deploy()
    await nftMarket.deployed()
		nftMarketContractAddr = nftMarket.address

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT")
    nft = await NFT.deploy(nftMarketContractAddr)
    await nft.deployed()
		nftContractAddr = nft.address
  });

	it('#createNft', async () => {
	  await nft.createToken("https://www.hackdapp.com/1.jpg")
    await nft.createToken("https://www.hackdapp.com/2.jpg")

		expect(await nft.tokenURI(1)).to.equal("https://www.hackdapp.com/1.jpg")
		expect(await nft.tokenURI(2)).to.equal("https://www.hackdapp.com/2.jpg")
	})
})

describe("NFTMarket", async () => {
	let nftMarket
	let nft

	let nftMarketContractAddr
	let nftContractAddr

  beforeEach(async () => {
		/* deploy the NFT Market contract */
		const NFTMarket = await ethers.getContractFactory("NFTMarket")
		nftMarket = await NFTMarket.deploy()
    await nftMarket.deployed()
		nftMarketContractAddr = nftMarket.address

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT")
    nft = await NFT.deploy(nftMarketContractAddr)
    await nft.deployed()
		nftContractAddr = nft.address
  });

	it("#getListingPrice", async () => {
		expect(await nftMarket.getListingPrice()).to.equals(ethers.utils.parseEther('0.025'))
	})

	it("#createMarketItem", async () => {
    let listingPrice = await nftMarket.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    /* create two tokens */
    await nft.createToken("https://www.hackdapp.com/1.jpg")
    await nft.createToken("https://www.hackdapp.com/2.jpg")

    /* put both tokens for sale */
    await nftMarket.createMarketItem(nftContractAddr, 1, auctionPrice, { value: listingPrice })
    await nftMarket.createMarketItem(nftContractAddr, 2, auctionPrice, { value: listingPrice })

		let items = await nftMarket.fetchMarketItems();
		expect(items.length).to.equal(2);
	})

	it("#createMarketSale", async () => {
		let listingPrice = await nftMarket.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    /* create two tokens */
    await nft.createToken("https://www.hackdapp.com/1.jpg")
    await nft.createToken("https://www.hackdapp.com/2.jpg")

    /* put both tokens for sale */
    await nftMarket.createMarketItem(nftContractAddr, 1, auctionPrice, { value: listingPrice })
    await nftMarket.createMarketItem(nftContractAddr, 2, auctionPrice, { value: listingPrice })

		const [_, buyerAddress] = await ethers.getSigners();
		await nftMarket.connect(buyerAddress).createMarketSale(nftContractAddr, 1, { value: auctionPrice});

		let items = await nftMarket.fetchMarketItems();
		expect(items.length).to.equal(1);
	})

	it("#fetchMyNFTs", async () => {
		let listingPrice = await nftMarket.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    /* create two tokens */
    await nft.createToken("https://www.hackdapp.com/1.jpg")
    await nft.createToken("https://www.hackdapp.com/2.jpg")

    /* put both tokens for sale */
    await nftMarket.createMarketItem(nftContractAddr, 1, auctionPrice, { value: listingPrice })
    await nftMarket.createMarketItem(nftContractAddr, 2, auctionPrice, { value: listingPrice })

		const [_, buyerAddress] = await ethers.getSigners();
		await nftMarket.connect(buyerAddress).createMarketSale(nftContractAddr, 1, { value: auctionPrice});
		await nftMarket.connect(buyerAddress).createMarketSale(nftContractAddr, 2, { value: auctionPrice});

		let items = await nftMarket.fetchMyNFTs();
		expect(items.length).to.equal(0);
		items = await nftMarket.connect(buyerAddress).fetchMyNFTs();
		expect(items.length).to.equal(2);
	})

	it("#fetchItemsCreated", async () => {
		let listingPrice = await nftMarket.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    /* create two tokens */
		await nft.createToken("https://www.hackdapp.com/1.jpg")
    await nft.createToken("https://www.hackdapp.com/2.jpg")

    /* put both tokens for sale */
    await nftMarket.createMarketItem(nftContractAddr, 1, auctionPrice, { value: listingPrice })
    await nftMarket.createMarketItem(nftContractAddr, 2, auctionPrice, { value: listingPrice })

		let items = await nftMarket.fetchItemsCreated();
		expect(items.length).to.equal(2);
		const [_, buyerAddress] = await ethers.getSigners();
		await nftMarket.connect(buyerAddress).createMarketSale(nftContractAddr, 1, { value: auctionPrice});
		await nftMarket.connect(buyerAddress).createMarketSale(nftContractAddr, 2, { value: auctionPrice});

		items = await nftMarket.fetchItemsCreated();
		expect(items.length).to.equal(2);
	})

})
