import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View
} from "@react-pdf/renderer";
import { SHIPMENT_STATUS, SHIPMENT_TYPES } from "../../utils/constants";
import IconButton from "@material-ui/core/IconButton";
import { Visibility as VisibilityIcon } from "@material-ui/icons";
import { Button } from "@material-ui/core";

function MyDoc(props) {
  const { shipment } = props;
  console.log(shipment);
  return (
    <Document>
      <Page size="A4" style={{ padding: "10px" }}>
        <Text
          style={{ color: "#707070" }}
        >{`Shipment Name - ${shipment.shipmentName}`}</Text>
        <Text style={{ color: "#707070" }}>Shipment ID: {shipment._id}</Text>
        <Text style={{ color: "#707070" }}>
          Description - {shipment.description}
        </Text>
        <Text style={{ color: "#707070" }}>
          Created: {new Date(shipment.createdAt).toLocaleString()}
        </Text>
        <Text style={{ color: "#707070", marginTop: "1.5pt" }}>
          Created By: {shipment.user.fullName} ({shipment.user.username})
        </Text>
        <Text style={{ color: "#707070" }}>
          Status: {SHIPMENT_STATUS[shipment.shipmentStatus]}
        </Text>
        <Text style={{ color: "#707070", marginTop: "1.5pt" }}>
          Type: {SHIPMENT_TYPES[shipment.shipmentType]}
        </Text>
        <Text style={{ fontWeight: "bold", marginTop: "1.5pt" }}>Products</Text>
        {shipment.products.map(({ product, quantity }) => {
          const { productName, brand, price } = product;
          return (
            <View>
              <Text>{`${productName} (${brand})`}</Text>
              <Text>{`-----> Rs ${price}/piece\t\t`}</Text>
              <Text>{`-----> Quantity-${quantity}`}</Text>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

function Content(props) {
  const { shipment } = props;
  // console.log(shipment);
  return (
    <div>
      {/* <MyDoc shipment={shipment} /> */}
      <PDFDownloadLink
        document={<MyDoc shipment={shipment} />}
        fileName="report.pdf"
      >
        {({ blob, url, loading, error }) =>
          loading ? (
            "Loading document..."
          ) : (
            <Button variant="contained" color="primary">
              Download As PDF
            </Button>
          )
        }
      </PDFDownloadLink>
    </div>
  );
}

export default Content;
