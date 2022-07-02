import React from "react";
// @material-ui/core components

import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Card from "../../components/Card/Card";
import CardIcon from "../../components/Card/CardIcon";
import { Book, DeleteForever, MailOutline } from "@material-ui/icons";
import CustomInput from "../../components/CustomInput/CustomInput";
import Button from "../../components/CustomButtons/Button";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { makeStyles } from "@material-ui/core/styles";
import ProductSelect from "../../components/ProductSelect/ProductSelect";
import { TextField } from "@material-ui/core";
import {orderService} from "../../services/orderService";
import CardFooter from "../../components/Card/CardFooter";
import Select from "../../components/Select/Select";

const useStyles = makeStyles(styles);

export default function OrderCreate() {
  const { register, handleSubmit, setValue } = useForm();
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const [items, setItems] = React.useState([]);
  const [status, setStatus] = React.useState("");

  function addProduct(product) {
    if (!product) return;
    const oldItem = items.find((item) => item.product.id === product.id);
    const index = items.findIndex((item) => item.product.id === product.id);
    if (oldItem) {
      items[index] = { ...oldItem, quantity: Number(oldItem.quantity) + 1 };
      setItems([...items]);
      return;
    }
    const newItems = [
      ...items,
      {
        product,
        quantity: 1,
      },
    ];
    setItems(newItems);
  }

  function removeProduct(id) {
    const index = items.findIndex((item) => item.product.id === id);
    items.splice(index, 1);
    setItems([...items]);
  }

  function changeQuantity(productId, quantity) {
    const index = items.findIndex((item) => item.product.id === productId);
    const oldItem = { ...items[index] };
    items[index] = { ...oldItem, quantity };
    setItems([...items]);
  }

  async function create(payload) {
    try {
      await orderService.create(payload);
      toast.success("Created");
      window.setTimeout(
        () => history.push("/admin/order"),
        500
      );
    } catch (e) {
      toast.error(e?.response?.data?.message[0]);
      console.log(e);
    }
  }

  async function update(payload) {
    try {
      await orderService.update(id, payload);
      toast.success("Updated");
    } catch (e) {
      toast.error(e?.response?.data?.message[0]);
      console.log(e);
    }
  }

  async function onSubmit(form) {
    const payload = {
      ...form,
      status,
      items: items.map(item => ({
        product: item.product.id,
        quantity: item.quantity,
        total: item.quantity * item.product.price,
      }))
    }
    if (id) {
      update(payload);
    } else {
      create(payload);
    }
  }

  async function fetchOrder() {
    try {
      const { data } = await orderService.view(id);
      const fields = ["customerPhone", "customerName", "customerAddress"];
      fields.forEach((field) => setValue(field, data[field]));
      setItems(data.items);
      setStatus(data.status);
    } catch (e) {
      console.log(e);
    }
  }

  function calculateTotal() {
    return items.reduce((total, currentItem) => total + currentItem.product.price * currentItem.quantity, 0);
  }

  React.useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={4}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <MailOutline />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Customer</h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CustomInput
                labelText="Customer name"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "text",
                  ...register("customerName"),
                }}
              />
              <CustomInput
                labelText="Customer phone"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "text",
                  ...register("customerPhone"),
                }}
              />
              <CustomInput
                labelText="Customer address"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "text",
                  ...register("customerAddress"),
                }}
              />
              <Select
                value={status}
                onChange={setStatus}
                label={"Status"}
                options={[
                  { value: "pending", label: "PENDING" },
                  { value: "shipping", label: "SHIPPING" },
                  { value: "success", label: "SUCCESS" },
                  { value: "return", label: "RETURN" },
                ]}
              />
              <Button color="rose" type="submit">Submit</Button>
            </form>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={8}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <Book />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Items</h4>
          </CardHeader>
          <CardBody>
            <ProductSelect
              haveAll={false}
              onSelected={(product) => addProduct(product)}
            />
            <div className="ReactTable">
              <table role="table" className="rt-table">
                <thead className="rt-thead -header">
                  <tr role="row" className="rt-tr">
                    <th
                      role="columnheader"
                      className="rt-th rt-resizable-header -cursor-pointer"
                    >
                      image
                    </th>
                    <th
                      role="columnheader"
                      className="rt-th rt-resizable-header -cursor-pointer"
                    >
                      Product
                    </th>
                    <th
                      role="columnheader"
                      className="rt-th rt-resizable-header -cursor-pointer"
                    >
                      Price
                    </th>
                    <th
                      role="columnheader"
                      className="rt-th rt-resizable-header -cursor-pointer"
                    >
                      Quantity
                    </th>
                    <th
                      role="columnheader"
                      className="rt-th rt-resizable-header -cursor-pointer"
                    >
                      <div className="actions-right">Total</div>
                    </th>
                    <th
                      role="columnheader"
                      className="rt-th rt-resizable-header -cursor-pointer"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody role="rowgroup" className="rt-tbody">
                  {items.map((item) => (
                    <tr key={item.product.id} className="rt-tr" role="row">
                      <td role="cell" className="rt-td">
                        <img
                          loading="lazy"
                          width="50"
                          src={item.product?.image}
                        />
                      </td>
                      <td role="cell" className="rt-td">
                        {item.product.title}
                      </td>
                      <td role="cell" className="rt-td">
                        {item.product.price}
                      </td>
                      <td role="cell" className="rt-td">
                        <TextField
                          value={item.quantity}
                          onChange={(e) =>
                            changeQuantity(item.product.id, e.target.value)
                          }
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                        />
                      </td>
                      <td role="cell" className="rt-td">
                        <div className="actions-right">
                          {item.quantity * item.product.price}
                        </div>
                      </td>
                      <td role="cell" className="rt-td">
                        <div className="actions-right">
                          <Button
                            justIcon
                            round
                            simple
                            onClick={() => removeProduct(item.product.id)}
                            color="danger"
                          >
                            <DeleteForever />
                          </Button>{" "}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
          <CardFooter>
            <Button color="success">TOTAL:  {calculateTotal()}</Button>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
