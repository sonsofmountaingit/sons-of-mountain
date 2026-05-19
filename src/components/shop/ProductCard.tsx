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
    <div className="group relative flex flex-col rounded-lg overflow-hidden border bg-white hover:shadow-md transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {image ? (
          <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-300">
            <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        {savings && (
          <span className="absolute top-2 left-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
            −€{savings.toFixed(0)}
          </span>
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-600">Sold out</span>
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <WishlistButton itemType="product" itemId={id} className="bg-white shadow" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {category && <p className="text-xs text-gray-400 uppercase tracking-wide">{category}</p>}
        <Link href={`/shop/products/${slug}`} className="text-sm font-semibold text-gray-900 hover:underline line-clamp-2">
          {title}
        </Link>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-gray-900">€{price.toFixed(2)}</span>
            {compareAtPrice && <span className="text-xs text-gray-400 line-through">€{compareAtPrice.toFixed(2)}</span>}
          </div>
          {!soldOut && (
            <AddToCartButton
              item={{ id: `product-${id}`, type: 'product', productId: id, title, unitPrice: price, quantity: 1, image: image ?? undefined, stock }}
              className="px-3 py-1.5 text-xs"
            >
              Add
            </AddToCartButton>
          )}
        </div>
      </div>
    </div>
  )
}
