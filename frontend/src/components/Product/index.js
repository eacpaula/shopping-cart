import React from "react"
import { Link } from "react-router-dom"
import { Grid } from "@material-ui/core"

import "./style.sass"

export default function Product(props) {
  const { data } = props

  return (
    <Grid item xs={3}>
      <Link to={`/detalhe/${data.id}`}>
        <div className={`product-item  ${data.stock === 0 ? 'no-stock' : ''}`}>
          <div className="product-item-img">
            <img
              src={`${process.env.REACT_APP_API_STATICS}/${data.image}`}
              alt={data.title}
            ></img>
          </div>
          <div className="product-item-title">
            <p>{data.title}</p>
          </div>
          <div className="product-item-price">
            <p>
              <span>R$</span>
              {data.price.toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
      </Link>
    </Grid>
  )
}