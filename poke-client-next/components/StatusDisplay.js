import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import BoltIcon from "@mui/icons-material/Bolt";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import HotelIcon from "@mui/icons-material/Hotel";
import { Tooltip } from "@mui/material";
const StatusDisplay = ({ statuses }) => {
  //boost atk
  //status slp
  const statusIcon = (status) => {
    console.log(status);
    const tokens = status.split(" ");
    if (tokens[0] == "boost") {
      switch (tokens[1]) {
        case "atk":
          return (
            <Tooltip title={"Attack Up"}>
              <ArrowUpwardIcon />
            </Tooltip>
          );
        case "accuracy":
          return (
            <Tooltip title={"Accuracy Up"}>
              <ArrowUpwardIcon />
            </Tooltip>
          );
        case "spe":
          return (
            <Tooltip title={"Speed Up"}>
              <ArrowUpwardIcon />
            </Tooltip>
          );
      }
    }

    if (tokens[0] == "unboost") {
      switch (tokens[1]) {
        case "atk":
          return (
            <Tooltip title={"Attack Down"}>
              <ArrowDownwardIcon />
            </Tooltip>
          );
        case "accuracy":
          return (
            <Tooltip title={"Accuracy Down"}>
              <ArrowDownwardIcon />
            </Tooltip>
          );
        case "spe":
          return (
            <Tooltip title={"Speed Down"}>
              <ArrowDownwardIcon />
            </Tooltip>
          );
        case "def":
          return (
            <Tooltip title={"Defence Down"}>
              <ArrowDownwardIcon />
            </Tooltip>
          );
      }
    }

    if (tokens[0] == "status") {
      switch (tokens[1]) {
        case "par":
          return (
            <Tooltip title={"Paralyzed"}>
              <BoltIcon key="par" />
            </Tooltip>
          );
          break;
        case "psn":
          return (
            <Tooltip title={"Poisoned"}>
              <BubbleChartIcon key={"psn"} />
            </Tooltip>
          );
          break;
        case "tox":
          return (
            <Tooltip title={"Toxic"}>
              <BubbleChartIcon key={"tox"} />
            </Tooltip>
          );
          break;
        case "brn":
          return (
            <Tooltip title={"Burn"}>
              <LocalFireDepartmentIcon key={"brn"} />
            </Tooltip>
          );
        case "slp":
          return (
            <Tooltip title={"Sleep"}>
              <HotelIcon key={"slp"} />
            </Tooltip>
          );
      }
    }
  };
  console.log(statuses);
  return (
    <div>
      {statuses.length ? (
        statuses.map((status) => {
          return statusIcon(status);
        })
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default StatusDisplay;
