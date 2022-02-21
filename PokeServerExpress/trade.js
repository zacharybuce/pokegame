export default class Battle {
  constructor(io, socket1, socket2, index, endTrade) {
    this.io = io;
    this.player1 = "";
    this.player2 = "";
    this.socket1 = socket1;
    this.socket2 = socket2;
    this.index = index;
    this.endTrade = endTrade;
    this.player1Offer = "";
    this.player2Offer = "";
    this.player1Ready = false;
    this.player2Ready = false;
    this.player1Accept = false;
    this.player2Accept = false;
    this.tradingEnd = false;
    this.tradingSuccess = false;
  }

  updateTrade() {
    this.io
      .to("trade" + this.index)
      .emit(
        "trade-update",
        this.player1Offer,
        this.player2Offer,
        this.player1Accept,
        this.player2Accept,
        this.tradingEnd,
        this.tradingSuccess
      );

    if (this.tradingSuccess) {
      this.tradingEnd = true;
      this.socket1.leave("trade" + this.index);
      this.socket2.leave("trade" + this.index);
      this.endTrade(this.index);
    }
  }

  startTrade() {
    console.log("starting trade...");
    this.socket1.join("trade" + this.index);
    this.socket2.join("trade" + this.index);

    this.socket1.on("ready-to-trade", (id) => {
      if (!this.tradingEnd) {
        console.log("socket1 is " + id);
        this.player1Ready = true;
        this.player1 = id;
        if (this.player1Ready && this.player2Ready && !this.tradingEnd)
          this.io
            .to("trade" + this.index)
            .emit("start-trade", this.player1, this.player2);
      }
    });

    this.socket2.on("ready-to-trade", (id) => {
      if (!this.tradingEnd) {
        console.log("socket2 is " + id);
        this.player2Ready = true;
        this.player2 = id;
        if (this.player1Ready && this.player2Ready && !this.tradingEnd)
          this.io
            .to("trade" + this.index)
            .emit("start-trade", this.player1, this.player2);
      }
    });

    this.socket1.on("new-trade-offer", (mon) => {
      if (!this.tradingEnd) {
        console.log("p1 Offer - ");
        console.log(mon);
        this.player1Offer = mon;

        this.player1Accept = false;
        this.player2Accept = false;
        this.updateTrade();
      }
    });

    this.socket2.on("new-trade-offer", (mon) => {
      if (!this.tradingEnd) {
        console.log("p2 Offer - ");
        console.log(mon);
        this.player2Offer = mon;

        this.player1Accept = false;
        this.player2Accept = false;
        this.updateTrade();
      }
    });

    //accept can be true or false
    this.socket1.on("trade-offer-accept", (accept) => {
      if (!this.tradingEnd) {
        console.log("p1 accepts trade offer");
        this.player1Accept = accept;

        if (this.player1Accept && this.player2Accept) {
          this.tradingSuccess = true;
        }
        this.updateTrade();
      }
    });

    this.socket2.on("trade-offer-accept", (accept) => {
      if (!this.tradingEnd) {
        console.log("p2 accepts trade offer");
        this.player2Accept = accept;
        if (this.player1Accept && this.player2Accept) {
          this.tradingSuccess = true;
        }
        this.updateTrade();
      }
    });

    this.socket1.on("end-trade", () => {
      if (!this.tradingEnd) {
        this.tradingEnd = true;
        this.updateTrade();
        this.socket1.leave("trade" + this.index);
        this.socket2.leave("trade" + this.index);
        this.endTrade(this.index);
      }
    });

    this.socket2.on("end-trade", () => {
      if (!this.tradingEnd) {
        this.tradingEnd = true;
        this.updateTrade();
        this.socket1.leave("trade" + this.index);
        this.socket2.leave("trade" + this.index);
        this.endTrade(this.index);
      }
    });
  }
}
