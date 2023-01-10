import React, { useEffect, useState, useRef } from "react";
import { Spacing, TextField, Paper, Avatar, FormControl, createTheme, ThemeProvider, Typography, Box, Button, AppBar, Card, CardContent, CardMedia, CssBaseline, Grid, Toolbar, Container } from "@material-ui/core";
import ConnectMetamask from './NavBar';
import voter from './images/voter.png'
import { blue } from "@material-ui/core/colors";
import useStyles from './styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from "./Input";
import { ethers } from "ethers";
import getBlockchain from "./Ethereum";
import { TextField, Grid, InputAdornment, IconButton, Select, Option } from '@material-ui/core';
import IconButton from "@material-ui/core";
import InputLabel from "@material-ui/core";
import axios from 'axios';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import NativeSelect from "@material-ui/core";

const { Identity } = require("@semaphore-protocol/identity");
const { Group } = require("@semaphore-protocol/group");
const { generateProof, packToSolidityProof, verifyProof } = require("@semaphore-protocol/proof");

const theme = createTheme();

const users = [];
var user = null;
var user2 = null;

const App = () => {

    const [accounts, setAccounts] = useState([]);
    const [isConnected, setIsConnected] = useState(Boolean);
    const [_identity, setIdentity] = useState('');
    const [vote, setVote] = useState('');
    const [_merkleRoot, setMerkleTreeRoot] = useState('');
    const [_nullifierHash, setNullifierHash] = useState('');
    const [_proof, setProof] = useState('');
    const [contract, setContract] = useState(undefined);
    const [commitmentGroup, setCommitmentGroup] = useState([]);

    const classes = useStyles();

    // console.log(Object.values(identityUser))
    // console.log(ethers.utils.formatBytes32String(vote.toString()))

    // console.log('_merkleRoot: ', _merkleRoot)
    // console.log('_nullifierHash: ', _nullifierHash)
    // console.log('_proof: ', _proof)

    // console.log(_identity)
    // console.log(isConnected)
    console.log(contract)
    // console.log("_identity: ", _identity)
    console.log("vote: ", vote)

    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword(!showPassword);

    useEffect(() => {
        getGroup().then((response) => {
            // console.log(response.data);
              setCommitmentGroup(response.data.group[0].group);
        }); 
        const init = async () => {
            const { contract } = await getBlockchain();
            setContract(contract);
        }
        init();
    }, [_identity]);


    const getGroup = async () => {
        const group = await axios.get(
            `http://localhost:5000/user/commitments`
          );

          return (group);
    }

    const castVote = async (e) => {
        e.preventDefault();

        const group = new Group();

        commitmentGroup.forEach((commitment) => {
            group.addMember(commitment);
        })

        console.log(group.members); // they already commited 
        // know they should create proof with this group and thier identities 

        const realIdentity = new Identity(_identity);
        console.log(realIdentity);

        const fullProof = await generateProof(realIdentity, group, 42, vote);
        const solidityProof = packToSolidityProof(fullProof.proof);

        console.log(fullProof)

        console.log(vote)
        console.log(fullProof.publicSignals.merkleRoot)
        console.log(fullProof.publicSignals.nullifierHash)
        console.log(solidityProof)

        await contract.methods.greet(
            ethers.utils.formatBytes32String(vote),
            fullProof.publicSignals.merkleRoot,
            fullProof.publicSignals.nullifierHash,
            solidityProof
        ).send(
            { from: accounts[0] }
        ).catch(function (error) {
            var msg = error;
            console.log(msg)
        });
    }

    const newGreet = async (e) => {
        e.preventDefault();

        const greeting = ethers.utils.formatBytes32String("Hello World");

        console.log(greeting);

        console.log(typeof(_proof));

        await contract.methods.greet(
            greeting,
            _merkleRoot,
            _nullifierHash,
            _proof
        ).send(
            { from: accounts[0] }
        );
    }

    const createAnonimouseVote = async (e) => {
        e.preventDefault();

        const group = new Group();

        commitmentGroup.forEach((commitment) => {
            group.addMember(commitment);
        })

        console.log(group.members); // they already commited 
        // know they should create proof with this group and thier identities 

        const realIdentity = new Identity(_identity);
        console.log(realIdentity);

        const fullProof = await generateProof(realIdentity, group, 42, vote);
        const solidityProof = packToSolidityProof(fullProof.proof);

        setProof(solidityProof);

        // console.log(fullProof)

        // console.log(vote)
        // console.log(fullProof.publicSignals.merkleRoot)
        // console.log(fullProof.publicSignals.nullifierHash)
        // console.log(_proof)

    }

    const greet = async () => {
        const group = new Group();

        users.push({
            identity: new Identity(),
            username: ethers.utils.formatBytes32String("anon1")
        })

        console.log(users)

        users.push({
            identity: new Identity(),
            username: ethers.utils.formatBytes32String("anon2")
        })

        group.addMember(users[0].identity.generateCommitment())
        group.addMember(users[1].identity.generateCommitment())

        // for (let i = 0; i < group.members.length; i++) {
        //     await contract.methods.joinGroup(group.members[i], users[i].username).send(
        //         { from: accounts[0] }
        //     );

        // }
        const greeting = ethers.utils.formatBytes32String("Hello World")

        const fullProof = await generateProof(users[1].identity, group, 42, greeting)
        console.log("solidityProof")
        const solidityProof = packToSolidityProof(fullProof.proof)

        await contract.methods.greet(
            greeting,
            fullProof.publicSignals.merkleRoot,
            fullProof.publicSignals.nullifierHash,
            solidityProof
        ).send(
            { from: accounts[0] }
        );

        const fullProof1 = await generateProof(users[0].identity, group, 42, greeting)
        const solidityProof1 = packToSolidityProof(fullProof1.proof)

        await contract.methods.greet(
            greeting,
            fullProof1.publicSignals.merkleRoot,
            fullProof1.publicSignals.nullifierHash,
            solidityProof1
        ).send(
            { from: accounts[0] }
        ).then(console.log)
    }


    return (
        <div>
            <Container maxWidth="lg">
                <ConnectMetamask accounts={accounts} setAccounts={setAccounts} setIsConnected={setIsConnected} setContract={contract} />
                    {
                        accounts[0]? (
                            <Container component="main" maxWidth="xs">
                            <Paper className={classes.paper} elevation={3}>
                                <Avatar src={voter} className={classes.avatar}></Avatar>
                                <Typography component="h1" variant="h5">Vote</Typography>
        
                                <br></br>
                                <br></br>
                                <div>
                                    <Typography variant="h7" align="left">
                                        1. Choose your Candidate
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="h7" align="left">
                                        2. Paste your Register Certificate 
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="h7 " align="left">
                                        3. Create Anonimouse Vote 
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="h7 " align="left">
                                        4. Publish your Anonimouse Vote   
                                    </Typography>
                                </div>
        
                                <br></br>
        
                                <form className={classes.form} onSubmit={castVote}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12}>
                                            <label for="candidates" >Choose a Candidate:</label>
                                                <select     
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={vote}
                                                    label="Vote"
                                                    defaultValue=""
                                                    onChange={(e) => setVote(e.target.value.toString())}>
                                                    <optgroup label="Swedish Candidate">
                                                        <option value={''}></option>
                                                        <option value={1}>first</option>
                                                        <option value={2}>second</option>
                                                    </optgroup>
                                                </select>
                                            <TextField
                                                className={classes.textField}
                                                name='register sertificate'
                                                onChange={(e) => setIdentity(e.target.value.toString())}
                                                variant="outlined"
                                                required
                                                fullWidth
                                                label='register sertificate'
                                                autoFocus
                                                type='text'
                                            />  
        
                                            
                                        </Grid>
                                    </Grid>
        
                                    <Button type="submit" onClick={createAnonimouseVote} fullWidth variant="contained" color="primary" className={classes.submit}>
                                    create Anonimouse Vote
                                    </Button>
        
                                    <br></br>  <br></br>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12}>
                                        <TextField
                                                className={classes.textField}
                                                name='ananimouse vote'
                                                variant="outlined"
                                                required
                                                fullWidth
                                                label='ananimouse vote'
                                                autoFocus
                                                type='text'
                                                value={_proof}
                                            /> 
                                        </Grid>
                                    </Grid>
        
                                    {
                                        _proof ? (                            
                                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                                            cast ananimouse vote 
                                        </Button>
                                    ) : (                                
                                        <Button type="submit" disabled="true" fullWidth variant="contained" color="primary" className={classes.submit}>
                                            cast ananimouse vote 
                                        </Button>)
                                    }
                                    <Grid container justify="flex-end">
                                        <Grid item>
                                            <Button onClick>
                                                Don't have Register Sertificate
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Paper>
                        </Container>
                        ) : (
                        <Container component="main" maxWidth="xs">
                            <Paper className={classes.paper} elevation={3}>
                                <Typography >Connect to Metamask</Typography>
                            </Paper>
                        </Container>
                        )
                    }
                <Button variant="contained" onClick={createAnonimouseVote}>
                createAnonimouseVote
                </Button>
                <Button variant="contained" onClick={greet}>
                    greet
                </Button>
            </Container>

        </div>
    )
}

export default App;









        // users.push({
        //     identity: new Identity(),
        //     username: ethers.utils.formatBytes32String("anon1")
        // })

        // console.log(users)

        // users.push({
        //     identity: new Identity(),
        //     username: ethers.utils.formatBytes32String("anon2")
        // })

        // group.addMember(users[0].identity.generateCommitment())
        // group.addMember(users[1].identity.generateCommitment())

        // console.log(group.members)
        // console.log(group)

        // for (let i = 0; i < group.members.length; i++) {
        //     await contract.methods.joinGroup(group.members[i], users[i].username).send(
        //         { from: accounts[0] }
        //     );

        // }


        // for (let index = 0; index < 4; index++) {
        //     const greeting = ethers.utils.formatBytes32String("Hello World")

        //     const fullProof = await generateProof(users[1].identity, group, 42, greeting)
        //     const solidityProof = packToSolidityProof(fullProof.proof)

        //     console.log('root: ', fullProof.publicSignals.merkleRoot)
        //     console.log('fullProof.publicSignals.nullifierHash: ', fullProof.publicSignals.nullifierHash)
        //     console.log(solidityProof)            
        // }

        // const greeting = ethers.utils.formatBytes32String("Hello World")

        // const fullProof = await generateProof(users[1].identity, group, 42, greeting)
        // const solidityProof = packToSolidityProof(fullProof.proof)

        // console.log('root: ', fullProof.publicSignals.merkleRoot)
        // console.log('fullProof.publicSignals.nullifierHash: ', fullProof.publicSignals.nullifierHash)
        // console.log(solidityProof)

        // setProof(solidityProof)


        // // const fullProof1 = await generateProof(users[0].identity, group, 42, greeting)
        // // const solidityProof1 = packToSolidityProof(fullProof1.proof)

        // // console.log('root1: ', fullProof.publicSignals.merkleRoot)
        // // console.log('fullProof1.publicSignals.nullifierHash: ', fullProof1.publicSignals.nullifierHash)
        // // console.log('proof: ', solidityProof1)


