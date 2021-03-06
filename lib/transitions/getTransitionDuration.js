var tweenFunction = require( 'tween-function' ),
    assign = require( 'lodash/object/assign' ),
    globalDefault = require( './defaultTransition' );



module.exports = function getTransitionDuration( def, stateFrom, stateTo, recurseDefault ) {

  var longestDuration = 0,
      recurseDefault, nDuration, cDef, typeFrom, typeTo;

  // if the current definition is not a function then try to read in the durations down the chain
  if( typeof def != 'function' ) {

    // create the recurseDefault which will be passed forward
    recurseDefault = assign( {}, globalDefault, recurseDefault, def );

    // evaluate creating tween functions
    for( var i in stateFrom ) {

      typeFrom = typeof stateFrom[ i ];
      typeTo = typeof stateTo[ i ];

      if( typeFrom == typeTo ) {

        // if both start and end state are numbers then we'll get a duration property
        if( typeFrom != 'object' ) {

          cDef = assign( {}, recurseDefault, def && def[ i ] );

          nDuration = cDef.duration + cDef.delay;
        } else {

          nDuration = getTransitionDuration( def && def[ i ], stateFrom[ i ], stateTo[ i ], recurseDefault );
        }

        longestDuration = getDuration( nDuration, longestDuration );
      }
    }
  // this was a function we'll still try to check if it has a duration and delay
  } else {

    if( def.duration ) {

      longestDuration += def.duration;
    }

    if( def.delay ) {

      longestDuration += def.delay;
    }
  }

  return longestDuration;
};

function getDuration( duration, longestDuration ) {

  if( duration > longestDuration ) {

    return duration;
  } else {

    return longestDuration;
  }
}