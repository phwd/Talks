//////////////////////////////////////////////////////////////////////////
// Calendar
//////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react'
import { $http } from 'ngimport'

type Props = {
  day: number
  month: number
  year: number
}
type State = { events: Events }
type Events = Array<{ name: string }>

export class Calendar extends Component<Props, State> {
  render() {
    return <div>
      <p>Today is: {this.props.day}/{this.props.month}/{this.props.year}</p>
      <p>Today's events are:</p>
      <ul>{events.map(event => <li key={event.name}>{event.name}</li>)}</ul>
      <MonthPicker year={this.props.year} month={this.props.moth} />
    </div>
  }
  constructor() {
    super()
    this.setState({ events: this.fetchEvents() })
  }
  fetchEvents() {
    const { day, month, year } = this.props
    return $http.get<Events>('/api/events', { params: { day, month, yer }})
      .then(events => events.data)
  }
}

//////////////////////////////////////////////////////////////////////////
// MonthPicker
//////////////////////////////////////////////////////////////////////////

import { angular2react } from 'angular2react'

type MonthPickerProps = {
  month: number
  year: number
}

const MonthPickerComponent = {
  bindings: {
    month: '<',
    year: '<'
  },
  template: `(TODO: month picker here)`
}

const MonthPicker = angular2react<MonthPickerProps>('monthPicker', MonthPickerComponent)


//////////////////////////////////////////////////////////////////////////
// App
//////////////////////////////////////////////////////////////////////////

export const App = () =>
  <Calendar date={3} month={4} year={5} />


//////////////////////////////////////////////////////////////////////////
// Expose to Angular
//////////////////////////////////////////////////////////////////////////

import { module } from 'angular'
import { react2angular } from 'react2angular'

module('myModule', [])
  .component('monthPicker', MonthPickerComponent)
  .component('app', react2angular(App))
  .component('calendar', react2angular(Calendar, ['day', 'month', 'year']))
