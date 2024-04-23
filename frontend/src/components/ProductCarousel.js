import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { Carousel, Image } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import Loader from "./Loader"
import Message from "./Message"
import { getTopProducts } from "../actions/productActions"

const ProductCarousel = () => {
  const dispatch = useDispatch()
  const { loading, error, products } = useSelector(
    (state) => state.productTopRated
  )

  useEffect(() => {
    dispatch(getTopProducts())
  }, [dispatch])

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <Carousel pause='hover' className='bg-dark'>
      {products.map((x) => (
        <Carousel.Item key={x._id}>
          <Link to={`/product/${x._id}`}>
            <Image src={x.image} alt={x.name} fluid />
            <Carousel.Caption className='carousel-caption'>
              <h2>
                {x.name} ($ {x.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarousel
