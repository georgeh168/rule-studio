import React from "react";
import PropTypes from "prop-types";
import { Chapter, Image } from "../Elements";
import Typography from "@material-ui/core/Typography";
import deleteDialog from "../resources/dialogs/delete.png";

function DeletingProject(props) {
    const { chapterId } = props;

    return (
        <Chapter
            title={"Deleting a project"}
            titleId={chapterId}
            content={
                <React.Fragment>
                    <Typography>
                        If you wish to delete current project, click on “Delete project” button (Fig. 2). A dialog
                        is going to be displayed with an input field to write your current project’s name (Fig. 8).
                        You can confirm deletion by clicking on “Ok” button or by pressing “Enter”.
                        You can cancel this process by clicking on “Cancel” button, pressing “Escape” 
                        or clicking outside this dialog.
                    </Typography>
                    <Image src={deleteDialog} caption={"FIGURE 8: Delete project dialog"} />
                </React.Fragment>
            }
        />
    );
}

DeletingProject.propTypes = {
    chapterId: PropTypes.string
};

export default DeletingProject;