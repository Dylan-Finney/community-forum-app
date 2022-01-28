import React, {useEffect} from "react";
import { request, gql } from 'graphql-request'
import {
  Row, Col,
  ListGroup, ListGroupItem,

} from 'reactstrap';
import { Link } from 'react-router-dom'
import moment from 'moment'

export default function GetQuestions(props){
  console.log("Child Rendered");
  const [questions, setQuestions] = React.useState([]);
  // const [questionsFinal, setQuestionsFinal] = React.useState([]);
  const [answers, setAnswers] = React.useState();
  const uri =process.env.REACT_APP_GRAPHQL_API;
  
  const query = gql`
  {
      questions{
        id
        account{
          username
        }
        title
        description
        date
        views{
          id
        }
        upvotes{
          id
        }
        downvotes{
          id
        }
      }
    }
`
const querySearch = gql`
query GetQuestionsSearched($search: String!){
    questions(where: {title_contains: $search}){
      id
      account{
        username
      }
      title
      description
      date
      views{
        id
      }
      upvotes{
        id
      }
      downvotes{
        id
      }
    }
  }
`
const queryAnswers = gql`
query MyQuery($id: ID!) {
  answersConnection(where: {question: {id: $id}}) {
    aggregate {
      count
    }
  }
}

`
  useEffect(()=> {
    const fetchData = async () => {
      if (props.query !== ''){
        const variables = {
          "search": props.query 
        }
        await request(uri, querySearch, variables).then((data) => setQuestions(data.questions))
        
      } else {
  
        await request(uri, query).then((data) => setQuestions(data.questions))
        // await request(uri, query).then((data) => console.log(data))
      }
        

      
      
    }
    fetchData().catch(console.error);;
    console.log(questions)
    

  },[]);
  // console.log(uri);



  return(
<div>
  {questions.map( (question)=> (
    
  <Row className='border mb-2' key={question.id}>

    <Col xs='3' className='my-auto mx-auto'>
        <Row >
            <small className='pl-2' >{question.views.length}</small>
            <small className='pl-2'>Views</small>
        </Row>
        <Row className="5">
            <small className='pl-2'></small>
            <small className='pl-2'>Answers</small>
        </Row>

        <Row className="5">
            <small className='pl-2'>{question.upvotes.length+question.downvotes.length}</small>
            <small className='pl-2'>Votes</small>
        </Row>


    </Col>
    <Col >
      <ListGroup className='text-left '>
        <ListGroupItem className='border-0 text-break'>
          <Link to={`/question/${question.title.replace(/[^A-Z0-9]+/ig, "-")}/${question.id}`}>
            {question.title} 
          </Link>
          <Row>
            <small className='pl-3'>{moment(question.date).fromNow()} by {question.account.username}</small>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Col>
  </Row>
  ))}




</div>
  );

}