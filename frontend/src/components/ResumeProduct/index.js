import React from 'react'
import { Grid } from '@material-ui/core'
import './style.sass'

export default function ResumeProduct(props) {
  const {
    data
  } = props

  return (
    <Grid item xs={12}>
        <div className="product-item-resume">
          <Grid item xs={1}>
            <div className="product-item-img-resume">
              <img src={`${process.env.REACT_APP_API_STATICS}/${data.product.image}`}
                    alt={data.product.title}></img>
            </div>
          </Grid>
          <Grid item xs={5}>
            <div className="product-item-title-resume">
              <p>{data.product.title}</p>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="product-item-qtd-resume text-center">
              <p>Quantidade: <span>{data.quantity}</span></p>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="product-item-price-resume text-right">
              <p><span>R$</span>{data.product.price.toLocaleString("pt-BR")}</p>
            </div>
          </Grid>
        </div>
    </Grid>
  )
}
