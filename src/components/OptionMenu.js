import React from 'react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

export default function OptionMenu({openDeleteDialog,handleDeleteClose,handleDeleteAction,handleMenuClose,handleMenuOption,userInfo,subject,anchorEl,openMenu}) {

    return (
        <>
            <Dialog open={openDeleteDialog} onClose={handleDeleteClose} >
                <DialogTitle>
                    Sure to proceed?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Note: This operation cannot be undone!
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{justifyContent:'center'}}>
                    <Button variant='contained' color='info' onClick={handleDeleteClose}>No</Button>
                    <Button variant='contained' color='error' onClick={handleDeleteAction}>Yes</Button>
                </DialogActions>
            </Dialog>
            {subject&&<> {subject.author===userInfo.name?
                <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose} transformOrigin={{vertical:'top',horizontal:'right'}} anchorOrigin={{vertical:'top',horizontal:'left'}}>
                     {/* comments don't have edit option */}
                    {subject.path===undefined
                    ?<MenuItem id='edit' onClick={handleMenuOption}>Edit</MenuItem>
                    :null}
                    <MenuItem id='delete' onClick={handleMenuOption}>Delete</MenuItem>
                </Menu>
                : 
                <Menu anchorEl={anchorEl} open={openMenu}  onClose={handleMenuClose} transformOrigin={{vertical:'top',horizontal:'right'}} anchorOrigin={{vertical:'top',horizontal:'left'}}>
                    <MenuItem id='follow' onClick={handleMenuOption}>{userInfo.following.findIndex(name=>name===subject.author)===-1?'Follow':'Unfollow'}</MenuItem>
                </Menu>        
            }</>}
        </>
    )
}
