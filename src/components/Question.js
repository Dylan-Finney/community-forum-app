import React, {useEffect, useContext, useCallback} from "react";
import { useParams } from "react-router-dom";
import { request, gql  } from 'graphql-request'
import { useNavigate } from 'react-router-dom';

import moment from 'moment'
// import { Row, Col,ListGroup,ListGroupItem,InputGroup, Input, Button, Form, } from 'reactstrap'
import CreateAnswer from './CreateAnswer';
import DeleteAnswer from './DeleteAnswer';
import DeleteQuestion from './DeleteQuestion';
import VoteQuestion from "./VoteQuestion";
import VoteAnswer from "./VoteAnswer";
import GetUserID from "./GetUserID";
import { AccountContext } from "./Account";
import {   FormControl,useDisclosure,
  FormLabel, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormErrorMessage,
  FormHelperText, Divider, Textarea , Button, Link, Text, Flex, Spacer, Box } from '@chakra-ui/react'
import {BiDownArrow, BiUpArrow} from "react-icons/bi"
import {RiContactsBookLine, RiDeleteBack2Fill} from "react-icons/ri"
import { isDisabled } from "@testing-library/user-event/dist/utils";


export default function Question({data}){
    
    const {questionid} = useParams();
    const [id, setID] = React.useState("");
    const [question, setQuestion] = React.useState([]);
    const [answers, setAnswers] = React.useState([]);
    const [response, setResponse] = React.useState([]);
    const [vote, setVote] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState("")
    const [votes, setVotes] = React.useState([])
    const [userID, setUserID] = React.useState("")
    const axios = require("axios");
    const [submit, setSubmit] = React.useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    let navigate = useNavigate();
    
    const {getUser} = useContext(AccountContext);

  
    const endpoint =process.env.REACT_APP_GRAPHQL_API;
    // const client = new GraphQLClient(uri)
    const variables = {
        "id": questionid 
    }
    const fillAnswer = (e) => {
      setResponse(e.target.value);
    }
    const createAnswer = async (e) => {
      setIsLoading("response")
      if (getUser() != null&&response!==""){
        const data = {
          questionID: questionid,
          body: response,
          accountID: getUser()
        }
       await CreateAnswer(data)
      }
      setResponse("")
      setSubmit(!submit)
      setIsLoading("")

    }

    const queryQuestion = gql`
    query GetQuestion($id: ID!){
      question(where: { id: $id }) {
        id
        title
        description
        views {
          id
        }
        upvotes {
          id
        }
        downvotes {
          id
        }
        account{
          username
        }
        date
        
      }
    }
    `

    // const resetState = () => {
    //   setVotes([])
    // }
    const queryAnswers = gql`
    query GetAnswers($id: ID!){
      answers(where: { question: {id: $id} }){
        id
        account{
          username
        }
        description
        date
        upvotes{
          id
        }
        downvotes{
          id
        }

    
        
      }
    }
    `
    useEffect(()=> {
      // console.log("Render")
      // const fetchQuestions = async () =>{
      //   let test1  = await request(endpoint, queryQuestion, variables)
      //   setQuestion(test1.question)
      //   return test1

      // }
      // const fetchAnswers = async () =>{
      //   let test2 = await request(endpoint, queryAnswers, variables)
        
      //   console.log(test2)
      //   setAnswers(test2.answers)

      //   return test2

      // }
      // GetUserVotes(fetchQuestions(),fetchAnswers())


      
      // const getData = async () => await fetchData()
      // (async() => {
      //   Promise.all(getData)
      //   Promise.resolve(getData)
        
      // })

      const fetchData = async () => {
        var votes = []
        // console.log(votes)
        
        // console.log(votes)
        if (getUser()!==null){
          var userID = await GetUserID(getUser())
          setUserID(userID)
        }
        
        // let test1  = await request(endpoint, queryQuestion, variables).then((data) => setQuestion(data.question))
        // let test2 = await request(endpoint, queryAnswers, variables).then((data) => setAnswers(data.answers))
        // let test1  = await request(endpoint, queryQuestion, variables)
        // let test2 = await request(endpoint, queryAnswers, variables)
        // console.log(test1)
        // console.log(JSON.stringify(test1, undefined, 2))
        
        const headers = {
          "content-type": "application/json",
            // "Authorization": "<token>"
        };
        const graphqlQueryQuestion = {
            "operationName": "GetQuestion",
            "query": `query GetQuestion($id: ID!){
              question(where: { id: $id }) {
                id
                title
                description
                views {
                  id
                }
                upvotes {
                  id
                }
                downvotes {
                  id
                }
                account{
                  username
                }
                date
                
              }
            }`,
            "variables": {"id": questionid}
        };
        const graphqlQueryAnswers = {
            "operationName": "GetAnswers",
            "query": `    query GetAnswers($id: ID!){
              answers(where: { question: {id: $id} }){
                id
                account{
                  username
                }
                description
                date
                upvotes{
                  id
                }
                downvotes{
                  id
                }
        
            
                
              }
            }`,
            "variables": {"id": questionid}
        };
  
        const responseQuestion = await axios({
          url: endpoint,
          method: 'post',
          headers: headers,
          data: graphqlQueryQuestion
        });
        const responseAnswers = await axios({
          url: endpoint,
          method: 'post',
          headers: headers,
          data: graphqlQueryAnswers
        });
        // console.log(responseQuestion)
        // console.log(responseAnswers)
        var question = responseQuestion.data.data.question
        var answers = responseAnswers.data.data.answers
        // console.log(question)
        // console.log(answers)
        setQuestion(question)
        setAnswers(answers)
        if (getUser()!==null){
        if (question.upvotes.some(e => e.id === userID)) {
          
          // if (votes===null){
            // votes = [questionA.id + "upvote"]
          // } else {
            votes.push(question.id + "upvote")
          // }
        } else if (question.downvotes.some(e => e.id === userID)) {
          // if (votes===null){
            // setVotes([questionA.id + "downvote"])
          // } else {
            // var x = votes
            // x.
            votes.push(question.id + "downvote")
            // setVotes(x)
          }
        
        answers.forEach(answer => {
            if (answer.upvotes.some(e => e.id === userID)) {
              // if (votes===null){
              //   setVotes([answer.id + "upvote"])
              // } else {
                var x = votes
                // x.
                votes.push(answer.id + "upvote")
              //   setVotes(x)
              // }
            } else if (answer.downvotes.some(e => e.id === userID)) {
              // if (votes===null){
              //   setVotes([answer.id + "downvote"])
              // } else {
              //   var x = votes
                // x.
                votes.push(answer.id + "downvote")
                // setVotes(x)
              // }
            }
            
          });
          
          setVotes(votes)
        }
          console.log(votes)



  
        // console.log(response.data.data.question); // data
        // console.log(question)
        // getState(response.data.data.question)
  
        // // setQuestion(response.data.data.question)
        // console.log(question)
        // console.log(response.errors); // errors if any
        
        // console.log(setQuestion(test1))
        // setQuestion(test1)
  
        // console.log(question)
  
        // GetUserVotes(test1,test2)
        // console.log(test1)
        // return true
        // answers.forEach(answer => {
          // if(answer.upvotes.includes(GetUserID(getUser()))){
          //   console.log("Right")
          // } else {
          //   console.log("Wrong")
          // }
        // });
        // console.log(question.upvotes.)
        // console.log(question.upvotes.includes("ckyn94gjk079g0b08bhkha4al"))
        
        // console.log(userID)
        // if(question.upvotes.includes(GetUserID(userID))){
        //   console.log("Right")
        // } else {
        //   console.log("Wrong")
        // }
  
  
          // if (votes!==[]){
          //   console.log("full")
          //   console.log(votes.splice())
          //   var x = votes
          //   // x.
          //   x.push(question.id + "upvote")
          //   setVotes(x)
          //   console.log(votes)
  
  
  
          // } else {
          //   console.log("empty")
          //   setVotes(question.id+"upvote")
          //   console.log(votes)
  
          // }
          /* vendors contains the element we're looking for */
        
      }





      fetchData()
      

      // setUserID(GetUserID())
      // fetchData().then(console.error);;
      // if (question.upvotes!==undefined){
      //   GetUserVotes()
      // }
      
    },[vote, submit]);
    

    const GetUserVotes = (question, answers) => {

      // if (question.upvotes.some(e => e.id === userID)) {
      //   if (votes===null){
      //     setVotes([question.id + "upvote"])
      //   } else {
      //     var x = votes
      //     // x.
      //     x.push(question.id + "upvote")
      //     setVotes(x)
      //   }
      // } else if (question.downvotes.some(e => e.id === userID)) {
      //   if (votes===null){
      //     setVotes([question.id + "downvote"])
      //   } else {
      //     var x = votes
      //     // x.
      //     x.push(question.id + "downvote")
      //     setVotes(x)
      //   }
      // }
      // console.log(votes)





      // answers.forEach(answer => {
      //   if (answer.upvotes.some(e => e.id === userID)) {
      //     if (votes===null){
      //       setVotes([answer.id + "upvote"])
      //     } else {
      //       var x = votes
      //       // x.
      //       x.push(answer.id + "upvote")
      //       setVotes(x)
      //     }
      //   } else if (answer.downvotes.some(e => e.id === userID)) {
      //     if (votes===null){
      //       setVotes([answer.id + "downvote"])
      //     } else {
      //       var x = votes
      //       // x.
      //       x.push(answer.id + "downvote")
      //       setVotes(x)
      //     }
      //   }
        
      // });
    }

    const GetUser = (data) => {
        if(data.account !== undefined){
          return data.account.username
        }
    };
    const Multiline = (data) => {
      if(data !== undefined){
        const newText = data.split ('\n').map ((item, i) => <p key={i}>{item}</p>);
        return newText
      }
      };
    
    const getVotes = () => {
      if (question.upvotes != undefined){
        return question.upvotes.length-question.downvotes.length
      }
    }

    const voteColor = (num) => {
      if (num>0){
        return "green"
      } else if (num<0){
        return "red"

      } else {
        return "black"

      }
    }

    // const upvote = (data) => {
    //   const data2 = {
    //     "id": data,
    //     "vote": "upvote"
    //   }
    //   if (data === question.id){
    //     VoteQuestion(data2)
    //   } else {

    //   }
    // }

    // const downvote = (data) => {
    //   const data2 = {
    //     "id": data,
    //     "vote": "downvote"
    //   }
    //   if (data === question.id){
    //     VoteQuestion(data2)
    //   } else {

    //   }
    // }


    async function upvote(id, key){
      // let loading = isLoading.slice()
      // loading[key] = true
      // setIsLoading(key)
      setVotes([])
      setIsLoading(id+"upvote")
      // setIsLoading(true)
      // setLoading(key)

      var data

      if (!activate(id, "upvote")){
        data = {
          "id": id,
          "vote": "upvote",
          "username": getUser(),
        }
          
      } else {
        data = {
          "id": id,
          "vote": null,
          "username": getUser(),
        }

      }
      if (id === question.id){
        await VoteQuestion(data)
      } else {
        await VoteAnswer(data)
      }
      setVote(!vote)
      setIsLoading("")
      // setLoading("")
      
    }

    async function downvote(id, key){
      // setIsLoading(true)
      setVotes([])
      setIsLoading(id+"downvote")
      var data;

      if (!activate(id, "downvote")){
        data = {
          "id": id,
          "vote": "downvote",
          "username": getUser(),
        }
          
      } else {
        data = {
          "id": id,
          "vote": null,
          "username": getUser(),
        }

      }

      
      if (id === question.id){
         await VoteQuestion(data)               
      } else {
          await VoteAnswer(data)       
      }
      setVote(!vote)
      
      setIsLoading("")
    }
    const loading = (id, type) => {
      const key = id + type
      if (key === isLoading){
        return true
      } else {
        return false
      }
    }

    const disabled = (obj, type) => {
      console.log(getUser())
      if (getUser()==null){
        return true
      }
      if (obj!==undefined&&obj.account!==undefined){
        if (typeof obj === "object") {
          // console.log(obj.account.username)
          if (obj.account.username !== getUser()){
            return true
          } else {
            return false
          }
          
  
        } else {
          const key = obj + type
          // console.log(getUser())
          if ((key !== isLoading && isLoading !== "")){
            return true
          } else {
            return false
          }
  
        }

      } else {
        return false
      }
      
      // if (obj.id !== undefined){
      //   console.log(obj)
      // }


    }

    const deleteEntity = async (id) => {
      setIsLoading(id+"delete")
      

      if (id === question.id){
        
        await DeleteQuestion(id)     
        navigate('/')          
     } else {
         await DeleteAnswer(id)
         
          setVote(!vote)       
     }
     onClose()
     setIsLoading("")

    }

    const openModal = (id) => {
      setID(id)
      onOpen()

    }


    const closeModal = () => {
      setID("")
      onClose()


    }

    const activate = (id, type) => {
      const key = id + type
      // console.log(key)
      // console.log(votes)
      // console.log(votes.includes(key))
      if (votes.includes(key)){
        return true
      } else {
        return false
      }
    }
    return(
      <Box>
        <Flex>
          {/* Upvote/Downvote */}
          <Box>
          <IconButton
            variant='outline'
            colorScheme='teal'
            aria-label='Call Sage'
            fontSize='20px'
            icon={<BiUpArrow />}
            isLoading={loading(question.id, "upvote")}
            isActive={activate(question.id, "upvote")}
            isDisabled={disabled(question.id, "upvote")}
            onClick={(e)=>upvote(question.id)}
          /><br/><Text align="center" color={voteColor(getVotes())}>{getVotes()}</Text>
          
          
          <IconButton
            variant='outline'
            colorScheme='red'
            aria-label='Call Sage'
            fontSize='20px'
            icon={<BiDownArrow />}
            // isLoading={isLoading}
            // id={`${question.id}downvote`}
            isLoading={loading(question.id, "downvote")}
            isActive={activate(question.id, "downvote")}
            isDisabled={disabled(question.id, "downvote")}
            onClick={()=>downvote(question.id)}
          />
          </Box>
          {/* Title */}
          <Box>
            <Text fontSize="xl" fontWeight="semibold">{question.title}</Text>
            <Text fontSize="xs">{moment(question.date).fromNow()} by {GetUser(question)}</Text>
            <Text>{Multiline(question.description)}</Text>

          </Box>
          <Spacer/>
          <Box>
            <br/>
            <IconButton
                      variant='outline'
                      colorScheme='red'
                      aria-label='Call Sage'
                      fontSize='20px'
                      isDisabled={disabled(question, "delete")}
                      onClick={()=>{openModal(question.id)}}
                      icon={<RiDeleteBack2Fill />}
                      
                    />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Text>Are you sure you want to delete this?</Text>
          </ModalBody>
          
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={()=>{deleteEntity(id)}} isLoading={loading(id, "delete")}>
              Delete
            </Button>
            <Spacer/>
            <Button colorScheme='blue' mr={3} onClick={()=>{closeModal()}} isDisabled={disabled()}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
            
          </Box>
        </Flex>
        {answers.map(answer=> (
                  <Box borderWidth='3px' borderRadius='lg' key={answer.id} >
                  <Flex>
                    <Box >
                    <IconButton
                      variant='outline'
                      colorScheme='teal'
                      aria-label='Call Sage'
                      fontSize='20px'
                      isLoading={loading(answer.id, "upvote")}
                      isActive={activate(answer.id, "upvote")}
                      isDisabled={disabled(answer.id, "upvote")}
                      onClick={()=>upvote(answer.id)}
                      icon={<BiUpArrow />}
                      
                    /><br/><Text align="center" color={voteColor(answer.upvotes.length-answer.downvotes.length)}>{answer.upvotes.length-answer.downvotes.length}</Text>
                    <IconButton
                      variant='outline'
                      colorScheme='red'
                      aria-label='Call Sage'
                      fontSize='20px'
                      isLoading={loading(answer.id, "downvote")}
                      isActive={activate(answer.id, "downvote")}
                      isDisabled={disabled(answer.id, "downvote")}
                      onClick={()=>downvote(answer.id)}
                      icon={<BiDownArrow />}
                    />
                    </Box>
                    
                    <Box >
                      <Text>{Multiline(answer.description)}</Text>
                      <Text fontSize="xs">{moment(answer.date).fromNow()} by {GetUser(answer)}</Text>
                    </Box>
                    <Spacer/>
          <Box>
            <br/>
            <IconButton
                      variant='outline'
                      colorScheme='red'
                      aria-label='Call Sage'
                      fontSize='20px'
                      isDisabled={disabled(answer, "delete")}
                      onClick={()=>{openModal(answer.id)}}
                      icon={<RiDeleteBack2Fill />}
                      
                    />
                    </Box>
                    
                  </Flex>
                </Box>

        ))}
            <br/>
            <Divider />
            <FormControl>
               <br/>
               <Textarea placeholder='Test' name='body' value={response} onChange={fillAnswer}></Textarea>
             <Button onClick={()=>{createAnswer()}} outline color="success" isLoading={loading("response", "")} isDisabled={disabled("response","")}>Reply</Button>{''}
           </FormControl>


      </Box>


    )

}
