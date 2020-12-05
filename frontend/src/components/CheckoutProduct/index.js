import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { Grid, Button } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

import * as storageHelper from "../../helpers/storage"

import "./style.sass"

export default function CheckoutProduct(props) {
  const { data, render, updatePrice, removeProduct } = props

  const [showElement, setShowElement] = React.useState(render)
  const [quantity, setQuantity] = React.useState(parseInt(data.quantity))
  const [price, setPrice] = React.useState(0)

  function handleInputChange(e) {
    if(data.product.stock < parseInt(e.target.value)) {
      setQuantity(data.product.stock)
      updateQuantityOfProduct(data.product.id, data.product.stock)
    }
    else if (parseInt(e.target.value) < 0) 
    {
      setQuantity(0)
    }
    else 
    {
      setQuantity(parseInt(e.target.value))
      updateQuantityOfProduct(data.product.id, parseInt(e.target.value))
    }
  }

  function handleAddQuantity(e) {
    let newQuantity = 0

    if(data.product.stock <  quantity + 1)
      newQuantity = data.product.stock
    else if (quantity)
      newQuantity= parseInt(quantity) + 1
    else
      newQuantity = 1

    setQuantity(newQuantity)
    updateQuantityOfProduct(data.product.id, newQuantity)
  }

  function handleSubtractQuantity(e) {
    if (quantity > 0) {
      let newQuantity = parseInt(quantity) - 1
      
      if(newQuantity === 0)
        newQuantity = 1

      setQuantity(newQuantity)
      updateQuantityOfProduct(data.product.id, newQuantity)
    } 
  }

  function handleRemoveProductFromCart(e) {
    var cart = storageHelper.getData("cart")

    if (cart && cart.products && Array.isArray(cart.products)) {
      const index = cart.products.findIndex(
        (x) => x.product.id === data.product.id
      )

      if (index >= 0) {
        cart.products.splice(index, 1)

        storageHelper.setData("cart", cart)

        setShowElement(false)

        removeProduct()
      }
    }
  }

  function updateQuantityOfProduct(id, quantity) {
    var cart = storageHelper.getData("cart")

    if (cart && cart.products && Array.isArray(cart.products)) {
      const index = cart.products.findIndex( (x) => x.product.id === id)

      if (index >= 0) {
        cart.products[index].quantity = quantity

        storageHelper.setData("cart", cart)
      } 
    }
  }

  useEffect(() => {
    if (data && quantity) {
      setPrice(quantity * data.product.price)

      updatePrice()
    }
  }, [data, price, quantity, props, updatePrice])

  return (
    showElement && (
      <Grid item xs={12}>
        <div className="product-item-checkout">
          <Grid item xs={1}>
            <div className="product-item-img-checkout">
              <Link to={`/detalhe${data.product.id}`}>
                <img
                  src={`${process.env.REACT_APP_API_STATICS}/${data.product.image}`}
                  alt={data.product.title}
                ></img>
              </Link>
            </div>
          </Grid>
          <Grid item xs={5}>
            <div className="product-item-title-checkout">
              <p>{data.product.title}</p>
              <button className="delete" onClick={handleRemoveProductFromCart}>
                <FontAwesomeIcon icon={faTrash} /> <span>Excluir</span>
              </button>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="product-item-qtd-checkout text-center">
              <Button className="qtd-min" onClick={handleSubtractQuantity}>
                -
              </Button>
              <input
                placeholder={data.product.stock > 0 ? "1" : "0"}
                disabled={data.product.stock <= 0 ? true : false}
                value={quantity}
                onChange={handleInputChange}
              ></input>
              <Button className="qtd-max" onClick={handleAddQuantity}>
                +
              </Button>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="product-item-price-checkout text-right">
              <p>
                <span>R$</span>
                {price.toLocaleString("pt-BR")}
              </p>
            </div>
          </Grid>
        </div>
      </Grid>
    )
  )
}
