const _ = require('underscore')
const keystone = require('keystone')
const Category = keystone.list('Category')
const categories = {
  'Gross Motor': ['Lifts head without support', 'Rolls front to back', 'Rolls back to front', 'Sits unsupported if positioned', 'Bear weight on legs', 'Scoots on bottom', 'Commando Crawl', 'Crawls on hands and knees', 'Pulls self to stand', 'Stands alone >2 seconds', 'Walks with support', 'Walks independently', 'Walks up stairs, both feet on each step, holding rail', 'Walks down stairs, both feet on each step, holding rail', 'Walks down stairs, both feet on each step, holding rail', 'Walks up stairs, alternating feet, holding rail only', 'Walks down stairs, alternating feet, holding rail only', 'Runs without falling', 'Throws ball overhand using one hand', 'Kicks ball forward', 'Jumps (feet >1 inch off ground)', 'Pedals tricycle (modified Valco pedals okay)', 'Balances on any foot for 5 seconds with support', 'Balances on any foot for 5 seconds without support', 'Hops on one foot', 'Skips alternating feet', 'Rides a bycicle (no training wheels)'],
  'Fine Motor': ['Holds small object (size of Lego block)', 'Reaches for object', 'Picks up objects', 'Transfers one hand to other', 'Puts objects in cup', 'Uses pincer grasp', 'Points using index finger', 'Claps hands together', 'Turns pages of a book', 'Stacks 2-4 blocks', 'Holds crayon and makes a mark', 'Scribbles with crayon', 'Imitates a stroke', 'Copies a circle', 'Holds pencil with a tripod grasp', 'Colors within the lines', 'Rolls and squeezes clay', 'Snips paper with scissors', 'Cuts on a line', 'Threads small beads (dime-size) on a string', 'Pastes and glues independently'],
  'Expressive Language': ['Makes sounds of pleasure e.g coos (ooh/ahh)', 'Makes single syllables (e.g. ma, ba)', 'Makes consonent-vowel sequences (e.g. dada/mama/baba nonspecific)', 'Says Dada or Mama discriminately', 'Waves bye-bye', 'Gestures/points for wants', 'Shakes head for yes/no', 'Sign language', 'Can communicate in phrases using signs only', 'Single words', 'Phrase speech (2-3 word phrases)'],
  'Receptive Language': ['Follows 180 degrees', 'Turns to sound', 'Follows one step commands when accompanies with gesture', 'Follows one step command without gesture', 'Responds to name', 'Understands meaning of \'no\'', 'Looks at objects/people when named', 'Follows two step commands without gesture', 'Responds to three step commands without gesture'],
  'Adaptive': ['Feeds self with hands', 'Drinks from open cup independently', 'Uses spoon or fork to eat', 'Takes off any clothing independently', 'Puts on any clothing without support', 'Brushes teeth independently', 'Combs or brushes own hair', 'Bathes or Showers independently', 'Out of diapers during the day (including time trained)', 'Out of diapers at night']
}
const categoryIds = {}

const create = function (params) {
  console.log(params, ' are the parameters')
  const item = {
    name: params[0],
    type: params[1]
  }
  if (params[2]) {
    item.parent = categoryIds[params[2]]
  }

  console.log(item)

  return new Category.model(item).save()
}

exports = module.exports = function(next) {

  const cat = _.map(categories, function(actions, cat) {
    return [cat, 'Marker Category']
  })

  const actions = _.map(categories, function(actions, cat) {
    const all = []
    _.each(actions, function(a) {
      all.push([a, 'Marker Action', cat])
    })
    return all
  })

  const categoryCreate = cat.map(create)
  const actionsCreate = _.flatten(actions, 1).map(create)

  Promise.all(categoryCreate).then(cats => {

    _.each(cats, function(c) {
      categoryIds[c.name] = c._id
    })

    return Promise.all(actionsCreate)
  }).then(acts => {
    console.log(acts)
    next()
  }).catch(err => console.log(err))
  next()
}
