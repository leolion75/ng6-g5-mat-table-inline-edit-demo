package com.nxp.gps.dvdrental

class Film {

    String title
    String description

    static mapping = {
        id column: 'film_id', generator: 'sequence', params: [sequence: 'film_film_id_seq'], sqlType: 'integer'
        version false
    }

    static constraints = {
        title nullable: false
    }
}
