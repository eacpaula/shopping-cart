import React, { useEffect } from "react"
import { Grid } from "@material-ui/core"
import { Link } from "react-router-dom"

import Layout from "../../components/Layout"
import CheckoutProduct from "../../components/CheckoutProduct"
import * as storageHelper from "../../helpers/storage"

import "./style.sass"

const Checkout = (props) => {
  var cart = storageHelper.getData("cart")

  const [total, setTotal] = React.useState(0)
  const [updateInfo, setUpdateInfo] = React.useState(false)

  const handleCallbackUpdateTotal = () => {
	  setUpdateInfo(true)
  }

  const handleCallbackRemoveProduct = () => {
	  setUpdateInfo(true)
  }

  useEffect(() => {
    if (cart && cart.products && Array.isArray(cart.products)) {
      let totalPrice = cart.products
        .map(x => { return { total: x.quantity * x.product.price } })
        .reduce((n, {total}) => n + total, 0)

      setTotal(totalPrice)
      setUpdateInfo(false)
    }
  }, [cart, total, updateInfo])

  return (
    <Layout updateBadge={updateInfo}>
      <main>
        <section className="checkout">
          <Grid container direction="row">
            <Grid item xs={12}>
              <div className="page-header">
                <h1>Carrinho</h1>
              </div>
            </Grid>
            {cart && Array.isArray(cart.products) && cart.products.length > 0 ? (
              cart.products.map((item) => (
                <CheckoutProduct data={item} key={`${item.product.id}`} render={true} updatePrice={handleCallbackUpdateTotal} removeProduct={handleCallbackRemoveProduct}></CheckoutProduct>
              ))
            ) : (
              <p>Não há produtos no carrinho</p>
            )}

            <Grid item xs={12}>
              <div className="checkout-total">
                <p>Total:</p>
                <p>
                  <span>R$</span>{total.toLocaleString("pt-BR")}
                </p>
              </div>
            </Grid>
            { cart && Array.isArray(cart.products) && cart.products.length > 0 && (
              <Grid item xs={12} >
                <Link to="/resumo" className="btn-pattern">
                  Continuar a Compra
                </Link>
              </Grid>
            )}
          </Grid>
        </section>
      </main>
    </Layout>
  )
}

export default Checkout