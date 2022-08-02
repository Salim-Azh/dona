import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'

export function Associations() {

    function createData(id, name, field) {
        return { name, field };
      }
      
      const rows = [
        createData(1, 'Sea shepard', "Animal protection"),
        createData(2, 'Green peace', "Ecological actions"),
        createData(3, 'Croix rouge', "Charity association")
      ];

    return (
        <div>
            <h1>Associations</h1>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Association</TableCell>
                        <TableCell align="right">Field</TableCell>
                        <TableCell align="right">Donate</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell align="right">{row.field}</TableCell>
                        <TableCell align="right"> <Button variant="contained">Donate</Button> </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
     </div>

    )
}

export default Associations