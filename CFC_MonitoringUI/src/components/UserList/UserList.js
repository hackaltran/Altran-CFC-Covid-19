import React, { Component } from "react";
import "./UserLists.scss";
import {
    Dropdown,
    Button
} from "carbon-components-react";
import { Add24, ChevronDown24, TrashCan20, ChevronDown20 ,Search20,CaretLeft20, CaretRight20} from '@carbon/icons-react';
import { getapi } from '../../services/webservices';

const pageOption = ['10 Items per page','20 Items per page','30 Items per page','50 Items per page'];
var localArray = [];
var currentPage = 0 ;
class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userType: 1,
            location: ['1', '2', '3'],
            pageOptionValue : '',
            currentPages : '',
            userNo : '10',
            userArray: [],
            totalPage : 0,
            originalArray : [],
        }
        this.addUserButton = this.addUserButton.bind(this);
    }

    componentDidMount() {
        this.getUserList();
    }

    addUserButton = (event) => {
        event.preventDefault();
        this.props.addUser();
    }

    pageSelect = (event)=>{
        var no = 10;
        if(event.selectedItem === pageOption[0]){
            no = 10;
        }else if(event.selectedItem === pageOption[1]){
            no = 20;
        }else if(event.selectedItem === pageOption[2]){
            no = 30;
        }else if(event.selectedItem === pageOption[4]){
            no = 50;
        }
        this.setState({ pageOptionValue: event.selectedItem ,userNo : no});
    }

    getUserList = () => {
        return getapi('doctors/allUser')
            .then(responseJson => {
                if (responseJson.responseCode !== 'ERROR') {
                    var dataArray = responseJson.docs;
                    var totalPageNo = Number(dataArray.length / this.state.userNo);
                    if((dataArray.length % this.state.userNo) === 0){
                        totalPageNo = totalPageNo;
                    }else{
                        totalPageNo = totalPageNo+1;
                    }
                    totalPageNo = totalPageNo | 0;
                    currentPage = 0;
                    this.setState({originalArray : responseJson.docs, totalPage: totalPageNo });

                    localArray = this.getSubArray();
                    this.setState({userArray : localArray}) 
                }
            });
    }

    nextPage=(event)=>{
        if(currentPage < (this.state.totalPage-1)){
            currentPage = currentPage +1;
        }else{
            return;
        }
        console.log("nextpage "+currentPage);
        localArray = this.getSubArray();
        this.setState({userArray : localArray, currentPages : currentPage })
    }

    previousPage=(event)=>{
        if(currentPage > 0 ){
            currentPage = currentPage -1;
        }
        console.log("previousPage "+currentPage);
        localArray = this.getSubArray();
        this.setState({userArray : localArray, currentPages : currentPage})
    }

    getSubArray(){
        var dispalyRecord = this.state.userNo;
        var arrrys = this.state.originalArray;
        
        var lRange = Number(currentPage * dispalyRecord);
        var uRange = Number(lRange) + Number(dispalyRecord);

        console.log("getSubArray "+lRange +" uRange "+uRange);

        var currentArray =[];
        if(uRange <= this.state.originalArray.length){
            currentArray = arrrys.slice(lRange,uRange)
        }else{
            currentArray = arrrys.slice(lRange,this.state.originalArray.length);
        }
        console.log("subArray  data "+JSON.stringify(currentArray))
        return currentArray;
    }

    render() {

        return (
            <React.Fragment>

                <div className="bx--row row-margin" style={{ display: 'flex', justifyContent: 'space-between', marginRight: 30 }}>

                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}/>

                    <div className="row" style={{ display: 'flex', justifyContent: 'flex-end' }}>

                        <Search20 className="search_icon" style={{marginTop :14,marginRight : 10,color : '#525252'}}/>

                        <div className="button1-div">
                            <Button kind="secondary" className="secondary1-div" type="submit" >
                                Filter
                                <ChevronDown24 className="cheveron-arrow" />
                            </Button>
                        </div>

                        <div className="button1-div">
                            <Button kind="primary" className="primary-div-user" type="submit" onClick={this.addUserButton} >
                                Add New User
                                <Add24 className="login-arrow" />
                            </Button>
                        </div>

                    </div>
                </div>

                <div style={{ marginRight: 25, marginTop: 24 }}>

                    <div className='row' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span id='title' style={{ marginLeft: 4, display: 'flex', justifyContent: 'flex-start' }}>List of Registered Users</span>

                        <div className="row" style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 10 }}>
                            <div className='.container' style={{ position: 'relative', backgroundColor: '#ff0' }}>
                            </div>

                                <div className="row" style={{marginTop: -13,}}>
                            <Dropdown
                                        items={pageOption}
                                        options={pageOption}
                                        id="gender"
                                        label="10 Items per page"
                                        lineWidth={0}
                                        value ={this.state.pageOptionValue}
                                        className="dropdown-invisible"
                                        onChange = {this.pageSelect.bind(this)}
                                    />
                            </div>
                            <span style={{ backgroundColor: '#e0e0e0', width: 1.5, height: 16 }} />

                            <span style={{ marginLeft: 10, paddingRight: 10, fontSize: 14 }}> {this.state.userArray.length} of {this.state.userNo} Users </span>
                            <span style={{ backgroundColor: '#e0e0e0', width: 1.5, height: 16, marginLeft: 5 }} />

                            <span style={{ marginLeft: 10, paddingRight: 10, fontSize: 14 }}> {this.state.currentPages+1} of {this.state.totalPage} pages </span>
                            <ChevronDown20 className="cheveron-arrow" style={{ marginTop: -3 }} />

                            <span style={{ backgroundColor: '#e0e0e0', width: 1.5, height: 16, marginLeft: 5, marginRight: 5 }} />

                            <CaretLeft20 className="cheveron-arrow" onClick={this.previousPage.bind(this)} style={{ marginTop: -3 }} />
                            <CaretRight20 className="cheveron-arrow" onClick={this.nextPage.bind(this)} style={{ marginTop: -3 }} />
                        </div>

                    </div>

                    <table className='table-div'>
                        <tbody>
                            <tr>{this.renderTableHeader()}</tr>
                            {this.renderTableData()}
                        </tbody>
                    </table>
                </div>

            </React.Fragment>
        );
    }

    renderTableHeader() {
        let header = ['Name', 'ID Number', 'Gender', 'Telephone', 'Email ID', 'Type of User']

        return header.map((value, index) => {
            return <th value={index} className='table-th'><span className="th-title">{value}</span></th>
        })
    }

    renderTableData() {
        return localArray.map((localArray, index) => {
            const { _id, name, gender, email, usertype, mobileno } = localArray //destructuring
            var customcolor = index % 2 == 0 ? '#ffffff' : '#f7f8f8';
            return (
                <tr key={_id} className='table-tr' style={{ backgroundColor: customcolor }}>
                    <td className='table-tr'><span className="td-title">{name}</span></td>
                    <td className='table-tr'><span className="td-title">{_id}</span></td>
                    <td className='table-tr'><span className="td-title">{gender}</span></td>
                    <td className='table-tr'><span className="td-title">{mobileno}</span></td>
                    <td className='table-tr'><span className="td-title">{email}</span></td>
                    <td className='table-tr'>
                        <div className='row' style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="td-title" style={{ display: 'flex', justifyContent: 'flex-start' }}>{usertype}</span>

                            <div className="row" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <TrashCan20 className="cheveron-arrow" />
                            </div>

                        </div>
                    </td>
                </tr>
            )
        })
    }
}

export default UserList;
