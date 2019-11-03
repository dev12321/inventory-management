import React from "react";
import { connect } from "react-redux";
import { CircularProgress, Typography } from "@material-ui/core";

const Loading = props => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1050,
        WebkitOverflowScrolling: "touch",
        outline: 0,
        background: "rgba(0, 0, 0, 0.3)",
        display: props.show ? "block" : "none"
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          marginLeft: -"100px",
          marginTop: -"10px",
          width: "200px",
          height: "20px",
          zIndex: 20000,
          textAlign: "center"
        }}
      >
        <Typography variant="h3" style={{ color: "grey", padding: "20px" }}>
          Loading...
          <CircularProgress color="secondary" />
        </Typography>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const loadingData = state.loading;

  return {
    show: state.common.loading
  };
};

export default connect(mapStateToProps)(Loading);
