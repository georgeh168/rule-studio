import React, {Component, Fragment} from 'react';
import DeleteProjectDialog from "./feedback/DeleteProjectDialog";
import Header from "../Header/Header";
import Help from "../Body/Help/Help";
import Home from "../Body/Home/Home";
import Import from "../Body/Import/Import";
import Project from "../RuleWorkComponents/API/Project";
import ProjectTabs from "../Body/Project/ProjectTabs";
import RenameProjectDialog from "./feedback/RenameProjectDialog";
import RuleWorkSnackbar from "../RuleWorkComponents/Feedback/RuleWorkSnackbar";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            body: "Home",
            currentProject: -1,
            projects: [],
            open: {
                renameDialog: false,
                deleteDialog: false,
            },
            snackbarProps: {
                open: false,
                variant: "info",
                message: "",
            },
            changed: Array(6).fill(false),
        };
    }

    componentDidMount() {
        fetch("http://localhost:8080/projects", {
            method: 'GET',
        }).then(response => {
            return response.json();
        }).then(result => {
            let projects = [];

            if (!result.isEmpty) {
                for (let i = 0; i < result.length; i++) {
                    projects = [...projects, new Project(result[i])]
                }
            }

            this.setState({
                projects: projects,
            })
        }).catch(error => {
            this.setState({
                snackbarProps: {
                    open: true,
                    variant: "error",
                    message: "Server doesn't respond. Couldn't load files",
                },
            }, () => {
                console.log(error);
            });
        });
    };

    updateProject = (project, tabValue) => {
        let projects = this.state.projects.slice(0);
        let changed = this.state.changed.slice(0);
        const currentProject = this.state.currentProject;

        projects[currentProject] = project;
        changed[tabValue] = true;

        this.setState({
            projects: projects,
            changed: changed,
        });
    };

    onBodyChange = (name) => {
        this.setState({
            body: name
        });
    };

    onCurrentProjectChange = (index) => {
        this.setState({
            body: "Project",
            currentProject: index,
        });
    };

    onSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        this.setState({
            snackbarProps: {
                open: false,
                variant: "info",
                message: "",
            }
        })
    };

    onFilesAccepted = (name, files) => {
        if (!this.isNameUnique(name)) {
            this.setState({
                snackbarProps: {
                    open: true,
                    variant: "warning",
                    message: "Project name already exists"
                },
            });
            return
        }

        let data = new FormData();
        data.append("name", name);
        for (let i = 0; i < files.length; i++) {
            data.append(files[i].type, files[i].file);
        }

        fetch("http://localhost:8080/projects", {
            method: 'POST',
            body: data,
        }).then(response => {
            return response.json();
        }).then(result => {
            const project = new Project(result);

            let newProjects = this.state.projects.slice(0);
            newProjects = [...newProjects, project];

            this.setState({
                body: "Project",
                currentProject: newProjects.indexOf(project),
                projects: newProjects,
                snackbarProps: {
                    open: true,
                    variant: "success",
                    message: `${result.name} has been created!`,
                },
            });
        }).catch(error => {
            console.log(error);
        })
    };

    onProjectDelete = () => {
        let open = this.state.open;
        open.deleteDialog = true;

        this.setState({
            open: open,
        });
    };

    onDeleteDialogClose = (action) => {
        if (action) {
            let projects = this.state.projects.slice(0);
            const currentProject = this.state.currentProject;

            if (currentProject === -1) return;

            const project = projects[currentProject];

            fetch(`http://localhost:8080/projects/${project.result.id}`, {
                method: 'DELETE',
            }).then(response => {
                return response.toString();
            }).then(() => {
                const removedProject = projects.splice(projects.indexOf(project), 1);

                this.setState({
                    body: "Home",
                    currentProject: -1,
                    projects: projects,
                    snackbarProps: {
                        open: true,
                        variant: "success",
                        message: `${removedProject[0].result.name} has been successfully deleted!`,
                    },
                })
            }).catch(error => {
                console.log(error);
            });
        }
        let open = this.state.open;
        open.deleteDialog = false;

        this.setState({
            open: open,
        });
    };

    onProjectRename = () => {
        let open = this.state.open;
        open.renameDialog = true;

        this.setState({
            open: open,
        });
    };

    onRenameDialogClose = (name) => {
        if (name) {
            if (this.isNameUnique(name)) {
                const currentProject = this.state.currentProject;
                let projects = this.state.projects.slice(0);

                let data = new FormData();
                data.append("name", name);

                fetch(`http://localhost:8080/projects/${projects[currentProject].result.id}`, {
                    method: "PATCH",
                    body: data,
                }).then(response => {
                    return response.json();
                }).then(result => {
                    projects[currentProject].result.name = result.name;

                    this.setState({
                        projects: projects,
                        snackbarProps: {
                            open: true,
                            variant: "success",
                            message: "Project name changed successfully!",
                        },
                    });
                }).catch(error => {
                    this.setState({
                        snackbarProps: {
                            open: true,
                            variant: "error",
                            message: "Server error! Couldn't change project name"
                        }
                    }, () => {
                        console.log(error)
                    });
                });
            } else {
                this.setState({
                    snackbarProps: {
                        open: true,
                        variant: 'warning',
                        message: "Project name already exists!"
                    }
                });
                return;
            }
        }
        let open = this.state.open;
        open.renameDialog = false;

        this.setState({
            open: open,
        });
    };

    isNameUnique = (name) => {
        const projects = this.state.projects.slice(0);
        const renameDialog = this.state.open.renameDialog;
        const currentProject = this.state.currentProject;

        for (let i = 0; i < projects.length; i++) {
            if (projects[i].result.name === name) {
                return renameDialog && currentProject === i;
            }
        }
        return true;
    };

    render() {
        const {body, currentProject, projects, open, snackbarProps, changed} = this.state;
        const {renameDialog, deleteDialog} = open;

        return (
            <Fragment>
                <Header
                    onButtonClick={(name) => this.onBodyChange(name)}
                    currentProject={currentProject + 1}
                    projects={["Select your projects", ...projects]}
                    onProjectClick={(index) => this.onCurrentProjectChange(index)}
                    onProjectDelete={() => this.onProjectDelete()}
                    onProjectRename={() => this.onProjectRename()}
                />
                {
                    {
                        "Help": <Help />,
                        "Home": <Home />,
                        "Import":
                            <Import
                                onFilesAccepted={(name, files) => this.onFilesAccepted(name, files)}
                            />,
                        "Project":
                            <ProjectTabs
                                changed={changed}
                                project={projects[currentProject]}
                                updateProject={this.updateProject}
                            />,
                    }[body]
                }
                <RenameProjectDialog
                    currentName={currentProject >= 0 ? projects[currentProject].result.name : ""}
                    open={renameDialog}
                    onClose={this.onRenameDialogClose}
                >
                    {renameDialog ? <RuleWorkSnackbar {...snackbarProps} onClose={this.onSnackbarClose} /> : null}
                </RenameProjectDialog>
                <DeleteProjectDialog
                    currentName={currentProject >= 0 ? projects[currentProject].result.name : ""}
                    open={deleteDialog}
                    onClose={this.onDeleteDialogClose}
                />
                {!renameDialog || !deleteDialog ?
                    <RuleWorkSnackbar {...snackbarProps} onClose={this.onSnackbarClose}/> : null
                }
            </Fragment>
        );
    }
}

export default App;
