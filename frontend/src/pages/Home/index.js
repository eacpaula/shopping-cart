import React from "react"
import { useGraphQL } from "graphql-react"
import { Grid } from "@material-ui/core"

import Layout from "../../components/Layout"
import Product from "../../components/Product"

import "./style.sass"

const Home = (props) => {
  const { loading, cacheValue: { data } = {} } = useGraphQL({
    fetchOptionsOverride(options) {
      options.url = process.env.REACT_APP_API
    },
    operation: {
      	query: `
			{
				products {
					id,
					title,
					image,
					price,
					stock
				}
			}
      	`
    },
    loadOnMount: true,
    loadOnReload: true,
    loadOnReset: true
  })

  return (
    <Layout>
      <main>
        <section className="home">
          <Grid container direction="row">
            <Grid item xs={12}>
              <div className="page-header">
                <h1>Destaques da Semana</h1>
              </div>
            </Grid>
			{
				data && data.products ? (
					data.products.map(product => (
						<Product data={product} key={product.id}/>
					))
				  ) : loading ? (
					<p>Loading…</p>
				  ) : (
					<p>Nenhum produto disponível!</p>
				  )
			}
          </Grid>
        </section>
      </main>
    </Layout>
  )
}

export default Home