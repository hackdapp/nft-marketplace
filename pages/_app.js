/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">NFT Marketplace</p>
        <div className="flex mt-4">
          <Link href="/"> <a className="mr-4 text-pink-500"> 首页 </a> </Link>
          <Link href="/create-item"> <a className="mr-6 text-pink-500"> 出售NFT </a> </Link>
          <Link href="/my-assets"> <a className="mr-6 text-pink-500"> 我的购买 </a> </Link>
          <Link href="/creator-dashboard"> <a className="mr-6 text-pink-500"> 我的出售 </a> </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
