import React, { useEffect } from "react"
import { useGraphQL } from "graphql-react"
import { Link, useParams, Redirect } from "react-router-dom"
import { Grid, Button } from "@material-ui/core"

import Layout from "../../components/Layout"
import * as storageHelper from "../../helpers/storage"

import "./style.sass"

const ProductDetail = (props) => {
  const [quantity, setQuantity] = React.useState(1)
  const [price, setPrice] = React.useState(0)
  const [redirectToCheckout, setRedirectToCheckout] = React.useState(false)

  const { id } = useParams()

  const handleAddToCart = (data) => {
    var cart = storageHelper.getData("cart")

    if (cart && cart.products && Array.isArray(cart.products)) {
      const index = cart.products.findIndex((x) => x.product.id === data.id)

      if (index >= 0) {
        cart.products[index].quantity =
          cart.products[index].quantity + quantity

        storageHelper.setData("cart", cart)
      } else {
        cart.products.push({
          quantity,
          product: data,
        })

        storageHelper.setData("cart", cart)
      }
    } else {
      cart = {
        products: [
          {
            quantity,
            product: data,
          },
        ],
      }

      storageHelper.setData("cart", cart)
    }

    setRedirectToCheckout(true)
  }

  function handleInputChange(e) {
    if (data.productById.stock < e.target.value) {
      setQuantity(data.productById.stock)
    } else if (e.target.value < 0) {
      setQuantity(0)
    } else {
      setQuantity(e.target.value)
    }
  }

  function handleAddQuantity(e) {
    let newQuantity = 0

    if (data.productById.stock < quantity + 1)
      newQuantity = data.productById.stock
    else if (quantity) 
      newQuantity = parseInt(quantity) + 1
    else
      newQuantity = 1

    setQuantity(newQuantity)
  }

  function handleSubtractQuantity(e) {
    if (quantity > 0) {
      let newQuantity = parseInt(quantity) - 1

      if(newQuantity === 0)
        newQuantity = 1

      setQuantity(newQuantity)
    }
  }

  const { loading, cacheValue: { data } = {} } = useGraphQL({
    fetchOptionsOverride(options) {
      options.url = process.env.REACT_APP_API
    },
    operation: {
      query: `
				{ 
					productById(id: "${id}") 
					{ 
						id,
						title,
						description,
						image,
						price,
						stock
					} 
				}
			`,
    },
    loadOnMount: true,
    loadOnReload: true,
    loadOnReset: true,
  })

  useEffect(() => {
    if (data && quantity) {
      setPrice(quantity * data.productById.price)
    }
  }, [data, price, quantity])

  return redirectToCheckout ? (
    <Redirect to={"/carrinho"} />
  ) : (
    <Layout>
      <main>
        <section className="product-detail">
          {data && data.productById ? (
            <Grid container direction="row">
              <Grid item xs={7}>
                <div className="product-detail-galery">
                  <img
                    src={`${process.env.REACT_APP_API_STATICS}/${data.productById.image}`}
                    alt={data.productById.title}
                  ></img>
                </div>
                <div className="product-detail-description">
                  <h2>Descrição</h2>
                  <p>{data.productById.description}</p>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="product-detail-info">
                  <h1>{data.productById.title}</h1>

                  <div className="product-detail-info-price">
                    <p>
                      <span>R$</span>
                      {price.toLocaleString("pt-BR")}
                    </p>
                    <p className="times">
                      em 12x R$
                      {(price / 12).toLocaleString("pt-BR")} sem juros
                    </p>
                  </div>
                  <p className="label">Quantidade</p>
                  <div className="product-detail-qtd text-center">
                    <Button
                      className="qtd-min"
                      onClick={handleSubtractQuantity}
                      disabled={data.productById.stock <= 0 ? true : false}
                    >
                      -
                    </Button>
                    <input
                      placeholder={data.productById.stock > 0 ? "1" : "0"}
                      disabled={data.productById.stock <= 0 ? true : false}
                      value={quantity}
                      onChange={handleInputChange}
                    ></input>
                    <Button
                      className="qtd-max"
                      onClick={handleAddQuantity}
                      disabled={data.productById.stock <= 0 ? true : false}
                    >
                      +
                    </Button>
                  </div>
                  <div className="buttons-detail">
                    {data.productById.stock > 0 ? (
                      <Link
                        to="/carrinho"
                        className="btn-pattern"
                        onClick={(e) => handleAddToCart(data.productById)}
                      >
                        Comprar agora
                      </Link>
                    ) : (
                      <Link
                        to="/carrinho"
                        className="btn-pattern no-stock"
                        onClick={(e) => e.preventDefault()}
                      >
                        Comprar agora
                      </Link>
                    )}
                    <button
                      className={`btn-pattern btn-pattern-add ${
                        data.productById.stock === 0 ? "no-stock" : ""
                      }`}
                      disabled={data.productById.stock <= 0 ? true : false}
                      onClick={(e) => {
                        if (data.productById.stock <= 0) e.preventDefault()
                        else handleAddToCart(data.productById)
                      }}
                    >
                      Adicionar ao carrinho
                    </button>
                    {data.productById.stock === 0 && (
                      <p>Produto Indisponível</p>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          ) : loading ? (
            <p>Loading…</p>
          ) : (
            <p>Não foi possível buscar os dados deste produto!</p>
          )}
        </section>
      </main>
    </Layout>
  )
}

export default ProductDetail
