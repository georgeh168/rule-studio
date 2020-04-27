import React, { Component } from 'react'

class DeleteProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_projektu: '3e004b4d-fb9a-4413-84b5-4d3f26c06f70'
        }
    }

    handleIdChange = (event) => {
        this.setState({
            id_projektu: event.target.value
        })
    }

    deleteProject = (event) => {
        event.preventDefault()

        fetch(`http://localhost:8080/projects/${this.state.id_projektu}`, {
            method: 'DELETE'
        }).then(response => {
            console.log(response)
            if(response.status === 204) {
                console.log("Succesful delete");
            } else {
                response.json().then(result => {
                    console.log("Wynik dzialania response.json():")
                    console.log(result)
                }).catch(err => {
                    console.log(err)
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div>
                id->
                <input type='text' value={this.state.id_projektu} onChange={this.handleIdChange} />
                <button onClick={this.deleteProject}>deleteProject</button>
            </div>
        )
    }
}

export default DeleteProject