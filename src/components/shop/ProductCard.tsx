import Link from 'next/link'
import Image from 'next/image'
import { AddToCartButton } from './AddToCartButton'
import { WishlistButton } from './WishlistButton'

interface ProductCardProps {
  id: string
  slug: string
  title: string
  price: number
  compareAtPrice?: number | null
  image?: string | null
  stock: number
  category?: string | null
}

export function ProductCard({ id, slug, title, price, compareAtPrice, image, stock, category }: ProductCardProps) {
  const soldOut = stock <= 0
  const savings = compareAtPrice && compareAtPrice > price ? compareAtPrice - price : null

  return (
    <div className="group relative flex flex-col bg-[#111] hover:bg-[#161616] transition-colors overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-[#0d0d0d]">
        {image ? (
          <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-white/10">
            <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        {savings && (
          <span className="absolute top-3 left-3 bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
            −€{savings.toFixed(0)}
          </span>
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-[#0a0a0a]/80 flex items-center justify-center">
            <span className="text-xs tracking-widest uppercase text-white/40">Sold out</span>
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <WishlistButton itemType="product" itemId={id} className="bg-[#111] border border-[#1a1a1a]" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {category && <p className="text-xs text-white/30 uppercase tracking-widest">{category}</p>}
        <Link href={`/shop/products/${slug}`} className="text-sm font-semibold text-white hover:text-white/70 transition-colors line-clamp-2">
          {title}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-white">€{price.toFixed(2)}</span>
            {compareAtPrice && <span className="text-xs text-white/30 line-through">€{compareAtPrice.toFixed(2)}</span>}
          </div>
          {!soldOut && (
            <AddToCartButton
              item={{ id: `product-${id}`, type: 'product', productId: id, title, unitPrice: price, quantity: 1, image: image ?? undefined, stock }}
              className="px-3 py-1.5 text-xs border border-[#1a1a1a] text-white/60 hover:border-white/30 hover:text-white transition-colors"
            >
              Add
            </AddToCartButton>
          )}
        </div>
      </div>
    </div>
  )
}
