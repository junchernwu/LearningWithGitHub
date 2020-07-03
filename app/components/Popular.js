import React from 'react'
import PropTypes from 'prop-types'
import fetchPopularRepos from '../utils/api'
import {FaUser, FaStar, FaCodeBranch, FaExclamationTriangle} from 'react-icons/fa'
import Loading from './Loading'
import Card from './Card'
import Tooltip from './Tooltip'

//use npm instal react-icons
//to use prop-types need to install: npm install prop-types in terminal
//functional component, stateless component so it avoids the THIS keyword
//abstracted languagesNav into its own component 


function LanguagesNav({selected, onUpdateLanguage}) {
    const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']
        //only has 1 render method and no other methods
        return (
            <ul className = 'flex-center'>
                {languages.map((language) => (
                    <li key = {language}>
                        <button className = 'btn-clear nav-link' 
                                //selected is the prop
                                style = {language == selected ? {color: 'rgb(187, 46,31)'} : null}
                                onClick = {() => onUpdateLanguage(language)}>
                            {language}
                        </button>
                    </li>
                ))}
                
            </ul>
        )
}

//to makesure the props are of correct type when we put in
LanguagesNav.propTypes = {
    selected:PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired
}

function ReposGrid ({repos}) {
    return(
        <ul className = 'grid space-around'>
            {repos.map((repo, index) => {
                const {name, owner, html_url, stargazers_count, forks, open_issues} = repo
                const {login, avatar_url} = repo.owner

                return(
                    <li key={html_url}>

                        <Card
                                    header={`#${index + 1}`}
                                    avatar={avatar_url}
                                    href={html_url}
                                    name={login}
                                    >
                                    <ul className='card-list'>
                                        <li>
                                        <Tooltip text="Github username">
                                            <FaUser color='rgb(255, 191, 116)' size={22} />
                                            <a href={`https://github.com/${login}`}>
                                            {login}
                                            </a>
                                        </Tooltip>
                                        </li>
                                        <li>
                                        <FaStar color='rgb(255, 215, 0)' size={22} />
                                        {stargazers_count.toLocaleString()} stars
                                        </li>
                                        <li>
                                        <FaCodeBranch color='rgb(129, 195, 245)' size={22} />
                                        {forks.toLocaleString()} forks
                                        </li>
                                        <li>
                                        <FaExclamationTriangle color='rgb(241, 138, 147)' size={22} />
                                        {open_issues.toLocaleString()} open
                                        </li>
                                    </ul>
                                    </Card>
                                </li>
                                )
                            })}
                            </ul>
                        )
                    }


ReposGrid.propTypes = {
    repos: PropTypes.array.isRequired
}
//class component **only class component can have state
export default class Popular extends React.Component {
    constructor(props) { 
        //super here refers to React.Component
        super(props);
        this.state = {
            selectedLanguage : 'All',
            repos: {},
            error: null

        }
        //bind the method to this component only in constructor
        this.updateLanguage = this.updateLanguage.bind(this);
        this.isLoading = this.isLoading.bind(this)
    }
    
    //when it first mounts
    componentDidMount () {
        this.updateLanguage(this.state.selectedLanguage)
    }

    //create a func to update the language when clicked on
    //nvr directly call it this.state.selectedLang== selectedLang
    updateLanguage (selectedLanguage) {
        this.setState({
            selectedLanguage,
            error: null,
            
        })//we need the error in state to show isLoading  
        // whenever we set state again, it re renders!!  the render func

        //if selectedlanguage is not yet in the repos 
        if (!this.state.repos[selectedLanguage]) {
            fetchPopularRepos(selectedLanguage)
                //merge current repos with new data with selected language as key
                .then((data) => {
                    this.setState(({repos}) => ({
                        repos: {
                            ...repos,
                            [selectedLanguage]: data
                        }
                    }))
                    //we pass in a func bec we are updating the current repos
                })
                .catch(() => {
                    console.warn('Error fetching repos: ', error)

                    this.setState({
                        error: 'There was an error fetching the repos'
                    })
                })
        }
        
    }
    //to show loading screen if error n repos r null
    isLoading() {
        const {selectedLanguage, repos, error} = this.state
        return !repos[selectedLanguage] && error == null

    }
    render() {
        const {selectedLanguage, repos, error} = this.state
        return (
            <React.Fragment>
                //we pull out languagesNav to the above so binding it to popular instance is impt
                <LanguagesNav
                    selected = {selectedLanguage}
                    onUpdateLanguage = {this.updateLanguage}
                    />
                {this.isLoading() && <Loading text='Fetching Repos' />}

                {error && <p className = 'center-text error'> {error} </p>}
                {repos[selectedLanguage] && <ReposGrid repos = {repos[selectedLanguage]}/>}
            </React.Fragment>
        )
    }
}