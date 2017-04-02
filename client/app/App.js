import 'babel-polyfill'
import React from 'react'
import {Component, PropTypes} from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {
    AppBar,
    TextField,
    RaisedButton,
    Card,
    List,
    ListItem,
    CircularProgress
} from 'material-ui'
import ActionLabel from 'material-ui/svg-icons/action/label-outline'
import FetchPlease from 'fetch-please'


export default class App extends Component {

  constructor(){
    super();
    this.state = {pending: false, pwdCount: 10, passwords:[], errorText: ''};
    this.api = new FetchPlease('http://localhost:3000/', {
        headers: {
            "Content-Type": "application/json"
        }
    });
  }


    countChanged(event,value){
      if (/^\d+$/.test(value) && +value > 0 && +value < 101) {
         this.setState({ errorText: '' })
       } else {
         this.setState({ errorText: 'От 1 до 100' })
       }

       this.setState({pwdCount:value});
    }

    generateClick = async() => {
        this.setState({pending: true});
        const pwdCount = +this.state.pwdCount;
        this.api.post('generate/', {pwdCount}).then((res) => {
            this.setState({passwords: res.passwords, pending: false})
        }).catch((err) => {
            this.setState({pending: false});
        });

    }

    cancelGenerating(){
      this.api.abort();
    }

    render() {
      const styles = {
          container: {
              display: 'flex',
              flexDirection: 'column',
              width: '800px',
              margin: '40px auto'
          },
          fields: {
              display: 'flex',
              flexDirection: 'row',
              flex: '1',
              alignItems: 'center',
              margin: '0px 24px'
          },
          input: {
              flex: '1',
              marginRight: '24px'
          },
          list: {
              marginTop: '48px',
              flex: '1'
          },
          progress: {
            margin: '48px 376px'
          }
      };

        return (
            <MuiThemeProvider>
                <div>
                    <AppBar title='Генератор'/>
                    <div style={styles.container}>
                        <Card>
                            <div style={styles.fields}>
                                <div style={styles.input}>
                                  <TextField id='numberinput' value={this.state.pwdCount} fullWidth={true} errorText= {this.state.errorText}
                                  onChange={this.countChanged.bind(this)} />
                                </div>
                                <div>
                                  {
                                    this.state.pending
                                    ? <RaisedButton id='cancel' secondary={true} label='Отменить' onTouchTap={this.cancelGenerating.bind(this)}  />
                                    : <RaisedButton id='generate' label='Сгенерировать' disabled={!!this.state.errorText} onTouchTap={this.generateClick} />
                                  }
                                </div>
                            </div>
                        </Card>
                        <Card style={styles.list}>
                        { this.state.pending ?
                            <CircularProgress size={48} thickness={5} style={styles.progress} />
                            :
                            <List>
                              {this.state.passwords.map((pass,index) =>
                                    <ListItem key={index} leftIcon={< ActionLabel />} primaryText={pass}/>
                              )}
                            </List>
                        }
                        </Card>
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}
