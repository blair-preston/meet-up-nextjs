// dynamically rendered page for multiple meetups with different id's
// id's should be part of the url
// and then when we load the page we want to use the id to fetch and display the appropriate data

import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from 'mongodb';

function MeetupDetails(props) {
    return (
        <MeetupDetail
            img={props.meetupData.image}
            title={props.meetupData.title}
            address={props.meetupData.address}
            description={props.meetupData.description}
        />
    )
}

export async function getStaticPaths() {
    //returns an object that describes all possible pages that need to be 
    // pre-generated
    // would also be fetched from database, but hardcoded for now
    // fallback: false, all supported paths are defined here -- pre generate these pages and give a 404 error if
    // a request for any other pages come in
    // fallback: true, pre-generate the following pages and also generate othe
    // paths. when the request comes in
    const client = await MongoClient.connect('mongodb+srv://blairpreston1:testpass123@cluster0.dmjyq.mongodb.net/meetup?retryWrites=true&w=majority');
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    // creates a path using the autogenerated id as the end of the url
    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray(); 

    client.close();

    return {
        fallback: false,
        paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() }}))
    }
}

export async function getStaticProps(context) {
    // fetch DATA for a single meetup

    // use context to know which single meetup data to be fetching
    const meetupId = context.params.meetupId;

    const client = await MongoClient.connect('mongodb+srv://blairpreston1:testpass123@cluster0.dmjyq.mongodb.net/meetup?retryWrites=true&w=majority');
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    // get data from selected meetup
    const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId),}); 

    client.close();

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                description: selectedMeetup.description,
            },
        },
    };
}

export default MeetupDetails;