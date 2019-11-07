import React from "react";
import ReactDOM from "react-dom";
// import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false
    };
  }
  componentDidMount() {
    this.setState({
      load: true
    });
    // axios.get("/").then(
    //   data => {
    //     // console.log(data.data);
    //     this.setState({
    //       load: true
    //     });
    //   },
    //   err => console.error(err)
    // );
  }
  render() {
    return (
      <div id = "content" >
        {this.state.load ? <div>Hello World</div> : <div></div>}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
