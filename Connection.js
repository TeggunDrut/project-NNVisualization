class Connection {
  constructor(options) {
    for (const option in options) {
      this[option] = options[option];
    }
    let from = this.from;
    let to = this.to;

    let fromEle = from.ele;
    let toEle = to.ele;

    let fromRect = fromEle.getBoundingClientRect();
    let toRect = toEle.getBoundingClientRect();

    let fromX = fromRect.x + fromRect.width;
    let fromY = fromRect.y + fromRect.height / 2;
    let toX = toRect.x;
    let toY = toRect.y + toRect.height / 2;

    let distance = Math.sqrt(
      Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2)
    );

    let angle = (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI;

    this.ele = document.createElement("div");
    this.ele.classList.add("connection");
    this.ele.style.width = `${distance}px`;
    this.ele.style.transform = `translate(${fromRect.x + fromRect.width}px, ${
      fromRect.y + fromRect.height / 2
    }px) rotate(${angle}deg)`;
    this.ele.style.position = "absolute";
    if (this.weight > 0)
      this.ele.style.backgroundColor = `rgba(255, 0, 0, ${Math.abs(
        this.weight / 0.5
      )})`;
    else
      this.ele.style.backgroundColor = `rgba(0, 0, 255, ${Math.abs(
        this.weight / 0.5
      )})`;

    document.body.appendChild(this.ele);
  }
  update(draw) {
    let fromEle = this.from.ele;
    let toEle = this.to.ele;

    let fromRect = fromEle.getBoundingClientRect();
    let toRect = toEle.getBoundingClientRect();

    let fromX = fromRect.x + fromRect.width;
    let fromY = fromRect.y + fromRect.height / 2;
    let toX = toRect.x;
    let toY = toRect.y + toRect.height / 2;

    let distance = Math.sqrt(
      Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2)
    );

    let angle = (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI;

    this.ele.style.width = `${distance}px`;
    this.ele.style.transform = `translate(${fromRect.x + fromRect.width}px, ${
      fromRect.y + fromRect.height / 2
    }px) rotate(${angle}deg)`;
    this.ele.style.position = "absolute";
    

    if (this.weight > 0)
      this.ele.style.backgroundColor = `rgba(255, 0, 0, ${Math.abs(
        this.weight / 0.5
      )})`;
    else {
      this.ele.style.backgroundColor = `rgba(0, 0, 255, ${Math.abs(
        this.weight / 0.5
      )})`;
    }

    if (draw)
      this.ele.innerText =
        this.weight.toString().split(".")[0] +
        "." +
        this.weight.toString().split(".")[1].slice(0, 2);
    else {
      this.ele.innerText = "";
    }
  }
}
