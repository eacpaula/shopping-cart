import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField, Modal } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import * as json5 from "json5";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  faCreditCard,
  faCheck,
  faTimes,
  faBarcode,
} from "@fortawesome/free-solid-svg-icons";

import Layout from "../../components/Layout";
import ResumeProduct from "../../components/ResumeProduct";
import * as storageHelper from "../../helpers/storage";

import "./style.sass";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid transparent",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Resume = (props) => {
  const cart = storageHelper.getData("cart");
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const [successPayment, setSuccessPayment] = React.useState(true);

  const schema = object().shape({
    creditcard: string().required(
      "O número do cartão de crédio é obrigatório!"
    ),
    fullname: string().required("O nome do titular é obrigatório!"),
    creditcard_expire_date: string().required(
      "A data de expiração do cartão de crédito é obrigatória!"
    ),
    creditcard_secret: string().required(
      "O código secreto do cartão de crédito é obrigatório!"
    ),
    documentation: string().required(
      "O CPF do titular do cartão de crédito é obrigatório!"
    ),
  });

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function onSubmit(data) {
    const query = `		
      mutation { 
        addOrder(
          costumer: "${process.env.REACT_APP_API_COSTUMER_SAMPLE}", 
          address: "${process.env.REACT_APP_API_COSTUMER_ADDRESS_SAMPLE}",
          products: ${
              json5.stringify(cart.products.map((x) => {
              // eslint-disable-next-line
              return { quantity: x.quantity, product: x.product.id };})).replace(/\'/g, '"')
          },
          payment_method: CreditCard,
          payment_creditcard: "${data.creditcard}",
          payment_creditcard_expire: "${data.creditcard_expire_date}",
          payment_creditcard_secret: "${data.creditcard_secret}",
          payment_creditcard_fullname: "${data.fullname}",
          payment_creditcard_documentation: "${data.documentation}",
          status: Open,
          total: ${total}
        ) { 
          id
        } 
      }
    `;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    };

    const result = await fetch(process.env.REACT_APP_API, opts);
    const response = await result.json();

    if (response.data && response.data.addOrder && response.data.addOrder.id) {
      storageHelper.removeData("cart");
      setSuccessPayment(true)
    } else {
      setSuccessPayment(false)
      const error = response.errors[0].message
      console.log(error)
    }

    handleOpen()
  }

  useEffect(() => {
    if (cart && cart.products && Array.isArray(cart.products)) {
      let totalPrice = cart.products
        .map((x) => {
          return { total: x.quantity * x.product.price };
        })
        .reduce((n, { total }) => n + total, 0);

      setTotal(totalPrice);
    }
  }, [cart, total]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <p id="simple-modal-description">
        <div className="modal-icon">
        { successPayment ? (
          <FontAwesomeIcon icon={faCheck} />
        ) : (
          <FontAwesomeIcon icon={faTimes} className="payment-fail-icon" />
        )}
          
        </div>
          { successPayment ? (
            <div className="modal-text">
              <h3>Obrigado!</h3>
              <p>Sua compra foi efetuada com sucesso!</p>
              <p>Em breve estaremos encaminhando o seu produto.</p>
            </div>
          ) : (
            <div className="modal-text">
              <h3>Cartão de crédito inválido!</h3>
              <p>Não foi possível processar sua compra, verifique o cartão de crédito valido abaixo do formulário</p>
            </div>
          )}
        <div className="">
          { successPayment ? (
            <Link to="/home" className="btn-pattern">
              Ok, entendi.
            </Link>
          ) : (
            <Link to="/home" className="btn-pattern" onClick={(e) => { e.preventDefault(); handleClose(); }}>
              Ok, entendi.
            </Link>
          )}
        </div>
      </p>
    </div>
  );

  return (
    <Layout>
      <main>
        <section className="Resume">
          <Grid container direction="row">
            <Grid item xs={7}>
              <div className="page-header">
                <h1>Resumo da Compra</h1>
              </div>
              {cart &&
              Array.isArray(cart.products) && cart.products.length > 0 ? ( 
                cart.products.map((item) => (
                  <ResumeProduct data={item} key={item.product.id}></ResumeProduct>
                ))
              ) : (
                <p>Não há produtos no carrinho</p>
              )}

              <div className="resume-total">
                <p>Total da Compra:</p>
                <p>
                  <span>R$</span>
                  {total.toLocaleString("pt-BR")}
                </p>
              </div>
            </Grid>
            <Grid item xs={5}>
              <div className="payment-methods">
                <h2>Formas de Pagamento</h2>
                <div className="painel">
                  <div className="painel-header">
                    <label>
                      <input
                        type="radio"
                        value="boleto"
                        disabled
                        defaultChecked={false}
                        readOnly={true}
                      />
                      <FontAwesomeIcon icon={faBarcode} /> Boleto
                    </label>
                  </div>
                </div>
                <div className="painel">
                  <div className="painel-header">
                    <label>
                      <input
                        type="radio"
                        value="credito"
                        defaultChecked={true}
                        readOnly={true}
                      />
                      <FontAwesomeIcon icon={faCreditCard} /> Cartão de Crédito{" "}
                    </label>
                    <p>Até 12 vezes sem juros</p>
                  </div>
                  <div className="painel-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <TextField
                        id="creditcard"
                        label="Número do cartão"
                        name="creditcard"
                        error={!!errors.creditcard}
                        helperText={
                          errors.creditcard ? errors.creditcard.message : ""
                        }
                        inputRef={register}
                        fullWidth
                      />
                      <TextField
                        id="fullname"
                        label="Nome completo"
                        name="fullname"
                        error={!!errors.fullname}
                        helperText={
                          errors.fullname ? errors.fullname.message : ""
                        }
                        inputRef={register}
                        fullWidth
                      />
                      <div className="row-info">
                        <TextField
                          id="creditcard_expire_date"
                          label="Data de Vencimento"
                          style={{ margin: 8 }}
                          name="creditcard_expire_date"
                          error={!!errors.creditcard_expire_date}
                          helperText={
                            errors.creditcard_expire_date
                              ? errors.creditcard_expire_date.message
                              : ""
                          }
                          inputRef={register}
                        />
                        <TextField
                          id="creditcard_secret"
                          label="Código de segurança"
                          style={{ margin: 8 }}
                          name="creditcard_secret"
                          error={!!errors.creditcard_secret}
                          helperText={
                            errors.creditcard_secret
                              ? errors.creditcard_secret.message
                              : ""
                          }
                          inputRef={register}
                        />
                      </div>
                      <TextField
                        id="documentation"
                        label="CPF do titular do cartão"
                        name="documentation"
                        error={!!errors.documentation}
                        helperText={
                          errors.documentation
                            ? errors.documentation.message
                            : ""
                        }
                        inputRef={register}
                        fullWidth
                      />
                      <div>
                        <button className="btn-pattern" type="submit">
                          Finalizar compra
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="valid-credit-card">
                    <p>Número de cartão de crédito válido: <span>5136 3333 3333 3335</span></p>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            className="modal"
            disableBackdropClick
          >
            {body}
          </Modal>
        </section>
      </main>
    </Layout>
  );
};

export default Resume;
