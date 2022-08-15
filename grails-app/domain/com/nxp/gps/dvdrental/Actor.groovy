package com.nxp.gps.dvdrental
import grails.rest.*

class Actor {

    String firstName
    String lastName
    Date lastUpdate    // maintained by Grails

    static constraints = {

        firstName nullable: false
        lastName nullable: false
        lastUpdate nullable: true

    }
}
