import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    constructor(prop: {}) {
        super(prop);
    }

    render() {
        return (
            <>
                Hello from React!
            </>
        );
    }
}


const domId = document.querySelector('#login_page');
ReactDOM.render(<App />, domId);
