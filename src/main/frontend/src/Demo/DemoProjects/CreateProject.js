import React, { Component } from 'react'

class CreateProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: 'newProject',
            metadata: '',
            data: '',
            rules: '',
            separator: ',',
            header: false
        }
    }

    handleNameChange = (event) => {
        this.setState({
            name: event.target.value
        })
    }

    handleSeparatorChange = (event) => {
        this.setState({
            separator: event.target.value
        })
    }

    handleHeaderChange = (event) => {
        this.setState({
            header: event.target.checked
        })
    }

    onMetadataChange = (event) => {
        this.setState({
            metadata: event.target.files[0]
        })
    }

    onDataChange = (event) => {
        this.setState({
            data: event.target.files[0]
        })
    }

    onRulesChange = (event) => {
        this.setState({
            rules: event.target.files[0]
        })
    }

    createProject = (event) => {
        event.preventDefault();

        let data = new FormData()
        data.append('name', this.state.name)
        data.append('metadata', this.state.metadata)
        data.append('data', this.state.data)
        data.append('rules', this.state.rules)
        data.append('separator', this.state.separator)
        data.append('header', this.state.header)

        fetch('http://localhost:8080/projects', {
            method: 'POST',
            body: data
        }).then(response => {
            console.log(response)
            return response.json()
        }).then(result => {
            console.log("Wynik dzialania response.json():")
            console.log(result)
        }).catch(err => {
            console.log(err)
        })
    }

    handleClick = (cb) => {
      console.log("Clicked, new value = " + cb.checked);
      console.log(cb.target.checked);
    }

    render() {
        return (
            <div>
                <h3>Create project</h3>
                name->
                <input type='text' value={this.state.name} onChange={this.handleNameChange} />
                metadata->
                <input onChange={this.onMetadataChange} type="file"></input>
                data->
                <input onChange={this.onDataChange} type="file"></input>
                rules->
                <input onChange={this.onRulesChange} type="file"></input>
                separator(only csv)->
                <input type='text' value={this.state.separator} onChange={this.handleSeparatorChange} />
                <input type="checkbox" id="headerCreateProject" onChange={this.handleHeaderChange} />
                <label for="headerCreateProject"> header </label>
                <br />
                <button onClick={this.createProject}>createProject</button>
            </div>
        )
    }
}

export default CreateProject