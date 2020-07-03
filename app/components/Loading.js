//to get the dot dot dot when loading
import React from 'react'
import PropTypes from 'prop-types'
//just do the styling here instead of css bec we want it to be a component we can load onto npm n be reused

const styles = {
  content: {
    fontSize: '35px',
    position: 'absolute',
    left: '0',
    right: '0',
    marginTop: '20px',
    textAlign: 'center',
  }
}

export default class Loading extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      content: props.text
    }
  }
  //when we first mount we set the window interval but the 
  //issue is that after mounted, set state keeps recurring
  //thats why we have a willunmount func 
  componentDidMount () {
    const { speed, text } = this.props

    this.interval = window.setInterval(() => {
      this.state.content === text + '...'
        ? this.setState({ content: text })
        : this.setState(({ content }) => ({ content: content + '.' }))
    }, speed)
  }
  componentWillUnmount () {
    window.clearInterval(this.interval)
  }
  render() {
    return (
      <p style={styles.content}>
        {this.state.content}
      </p>
    )
  }
}

Loading.propTypes = {
  text: PropTypes.string.isRequired,
  speed: PropTypes.number.isRequired,
}

Loading.defaultProps = {
  text: 'Loading',
  speed: 300
}
//setting the default prop so if the person doesnt customise 
//Loading still works