import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from '../pages/Home'
import Checkout from '../pages/Checkout'
import Resume from '../pages/Resume'
import ProductDetail from '../pages/ProductDetail'

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/carrinho">
        <Checkout />
      </Route>
      <Route path="/resumo">
        <Resume />
      </Route>
      <Route path="/detalhe/:id">
        <ProductDetail />
      </Route>
      <Route path="/">
        <Home />
      </Route>
     
    </Switch>
  </BrowserRouter>
)

export default Router