var tweenFunction = require( 'tween-function' ),
    _ = require( 'lodash' ),
    globalDefault = require( './defaultTransition' );



module.exports = function createTransitions( transition, transitionDuration, def, stateFrom, stateTo, recurseDefault ) {

  var defDefaults = {},
      hasDef = def !== undefined,
      defaultSettings, nDuration, cDef;

  // if we have a def get the duration, delay, ease defaults
  if( hasDef ) {

    def.duration !== undefined && ( defDefaults.duration = def.duration );
    def.delay !== undefined && ( defDefaults.delay = def.delay );
    def.ease !== undefined && ( defDefaults.ease = def.ease );

    // remove the default durations and eases so they aren't iterated over
    delete def.duration;
    delete def.delay;
    delete def.ease;
  }

  // create the defaultSettings which will be passed forward
  defaultSettings = _.assign( {}, globalDefault, defDefaults, recurseDefault );

  // evaluate creating tween functions
  for( var i in stateFrom ) {

    // if both start and end state are numbers then we'll create an ease function
    if( _.isNumber( stateFrom[ i ] ) && _.isNumber( stateTo[ i ] ) ) {

      cDef = _.assign( {}, defaultSettings, def && def[ i ] );

      cDef.delay /= transitionDuration;
      cDef.duration /= transitionDuration;

      transition[ i ] = tweenFunction( cDef );
    } else {

      transition[ i ] = {};

      createTransitions( transition[ i ], transitionDuration, def && def[ i ], stateFrom[ i ], stateTo[ i ], defaultSettings );
    }
  }

  // if we had a definition return the values
  if( hasDef ) {

    // return the default eases and durations
    defDefaults.duration !== undefined && ( def.duration = defDefaults.duration );
    defDefaults.delay !== undefined && ( def.delay = defDefaults.delay );
    defDefaults.ease !== undefined && ( def.ease = defDefaults.ease );
  }
};