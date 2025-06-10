import { useState } from 'react'
import { Star, Plus, ArrowLeft, ThumbsUp, ThumbsDown, Filter, Edit2 } from 'lucide-react'
import './App.css'

interface Product {
  id: string
  name: string
  description: string
  image: string
}

interface Feedback {
  id: string
  productId: string
  userName: string
  rating: number
  description: string
  reason: string
  upvotes: number
  downvotes: number
  timestamp: Date
}

const starReasons = {
  5: ['Highly promising', 'Great market potential', 'Strong team', 'Innovative solution'],
  4: ['Good concept', 'Solid execution', 'Growing market', 'Experienced founders'],
  3: ['Decent idea', 'Needs improvement', 'Competitive market', 'Mixed potential'],
  2: ['Weak concept', 'Poor execution', 'Limited market', 'Unclear strategy'],
  1: ['Bad idea', 'No potential', 'Failing startup', 'Avoid investment']
}

function App() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'EcoFood',
      description: 'AI-powered sustainable food delivery platform',
      image: '🌱'
    },
    {
      id: '2',
      name: 'MindSpace',
      description: 'Virtual reality mental health therapy platform',
      image: '🧠'
    },
    {
      id: '3',
      name: 'CodeMentor AI',
      description: 'AI-powered programming education and mentorship',
      image: '💻'
    }
  ])

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: '1',
      productId: '1',
      userName: 'Sarah Chen',
      rating: 5,
      description: 'Revolutionary approach to sustainable food delivery. The AI optimization is impressive and the market timing is perfect with growing environmental awareness.',
      reason: 'Highly promising',
      upvotes: 23,
      downvotes: 2,
      timestamp: new Date('2024-01-15')
    },
    {
      id: '2',
      productId: '1',
      userName: 'Mike Rodriguez',
      rating: 4,
      description: 'Strong concept and good execution. The team has deep experience in logistics. However, competition from existing delivery giants might be challenging.',
      reason: 'Good concept',
      upvotes: 18,
      downvotes: 3,
      timestamp: new Date('2024-01-20')
    },
    {
      id: '3',
      productId: '2',
      userName: 'Dr. Emily Wang',
      rating: 5,
      description: 'As a mental health professional, I see huge potential here. VR therapy is the future and this team understands both technology and healthcare.',
      reason: 'Innovative solution',
      upvotes: 31,
      downvotes: 1,
      timestamp: new Date('2024-01-18')
    },
    {
      id: '4',
      productId: '3',
      userName: 'Alex Thompson',
      rating: 4,
      description: 'Great timing with the AI boom. The programming education market is massive. The founders have solid tech backgrounds from major companies.',
      reason: 'Experienced founders',
      upvotes: 15,
      downvotes: 2,
      timestamp: new Date('2024-01-22')
    }
  ])

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showNewProductForm, setShowNewProductForm] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [showEditProductForm, setShowEditProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [sortBy, setSortBy] = useState<'rating' | 'timestamp'>('rating')
  const [startupSortBy, setStartupSortBy] = useState<'name' | 'rating' | 'insights' | 'newest'>('name')
  const [newProduct, setNewProduct] = useState({ name: '', description: '', image: '' })
  const [editProduct, setEditProduct] = useState({ name: '', description: '', image: '' })
  const [newFeedback, setNewFeedback] = useState({
    userName: '',
    rating: 5,
    description: '',
    reason: starReasons[5][0]
  })

  const addProduct = () => {
    if (newProduct.name.trim()) {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        description: newProduct.description,
        image: newProduct.image || '🚀'
      }
      setProducts([...products, product])
      setNewProduct({ name: '', description: '', image: '' })
      setShowNewProductForm(false)
    }
  }

  const startEditProduct = (product: Product) => {
    setEditingProduct(product)
    setEditProduct({
      name: product.name,
      description: product.description,
      image: product.image
    })
    setShowEditProductForm(true)
  }

  const saveEditProduct = () => {
    if (editingProduct && editProduct.name.trim()) {
      const updatedProducts = products.map(product => 
        product.id === editingProduct.id 
          ? {
              ...product,
              name: editProduct.name,
              description: editProduct.description,
              image: editProduct.image || '🚀'
            }
          : product
      )
      setProducts(updatedProducts)
      
      // Update selectedProduct if it's the one being edited
      if (selectedProduct && selectedProduct.id === editingProduct.id) {
        setSelectedProduct({
          ...editingProduct,
          name: editProduct.name,
          description: editProduct.description,
          image: editProduct.image || '🚀'
        })
      }
      
      setEditingProduct(null)
      setEditProduct({ name: '', description: '', image: '' })
      setShowEditProductForm(false)
    }
  }

  const cancelEditProduct = () => {
    setEditingProduct(null)
    setEditProduct({ name: '', description: '', image: '' })
    setShowEditProductForm(false)
  }

  const addFeedback = () => {
    if (selectedProduct && newFeedback.userName.trim() && newFeedback.description.trim()) {
      const feedback: Feedback = {
        id: Date.now().toString(),
        productId: selectedProduct.id,
        userName: newFeedback.userName,
        rating: newFeedback.rating,
        description: newFeedback.description,
        reason: newFeedback.reason,
        upvotes: 0,
        downvotes: 0,
        timestamp: new Date()
      }
      setFeedbacks([...feedbacks, feedback])
      setNewFeedback({
        userName: '',
        rating: 5,
        description: '',
        reason: starReasons[5][0]
      })
      setShowFeedbackForm(false)
    }
  }

  const updateFeedbackVotes = (feedbackId: string, type: 'upvote' | 'downvote') => {
    setFeedbacks(feedbacks.map(feedback => {
      if (feedback.id === feedbackId) {
        return {
          ...feedback,
          upvotes: type === 'upvote' ? feedback.upvotes + 1 : feedback.upvotes,
          downvotes: type === 'downvote' ? feedback.downvotes + 1 : feedback.downvotes
        }
      }
      return feedback
    }))
  }

  const getSortedProducts = () => {
    return [...products].sort((a, b) => {
      const aFeedbacks = feedbacks.filter(f => f.productId === a.id)
      const bFeedbacks = feedbacks.filter(f => f.productId === b.id)
      const aAvgRating = aFeedbacks.length > 0 ? aFeedbacks.reduce((acc, f) => acc + f.rating, 0) / aFeedbacks.length : 0
      const bAvgRating = bFeedbacks.length > 0 ? bFeedbacks.reduce((acc, f) => acc + f.rating, 0) / bFeedbacks.length : 0

      switch (startupSortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return bAvgRating - aAvgRating
        case 'insights':
          return bFeedbacks.length - aFeedbacks.length
        case 'newest':
          return parseInt(b.id) - parseInt(a.id)
        default:
          return 0
      }
    })
  }

  const productFeedbacks = selectedProduct 
    ? feedbacks.filter(f => f.productId === selectedProduct.id)
        .sort((a, b) => {
          if (sortBy === 'rating') {
            return b.rating - a.rating
          }
          return b.timestamp.getTime() - a.timestamp.getTime()
        })
    : []

  const StarRating = ({ rating, interactive = false, onChange }: { 
    rating: number, 
    interactive?: boolean, 
    onChange?: (rating: number) => void 
  }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(star => (
        <Star 
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${
            interactive ? 'cursor-pointer hover:text-yellow-400' : ''
          }`}
          onClick={interactive && onChange ? () => onChange(star) : undefined}
        />
      ))}
    </div>
  )

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setSelectedProduct(null)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Startups
          </button>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-4">{selectedProduct.image}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h1>
                <p className="text-gray-600">{selectedProduct.description}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Community Insights ({productFeedbacks.length})</h2>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as 'rating' | 'timestamp')}
                  className="border rounded px-3 py-1"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="timestamp">Sort by Date</option>
                </select>
              </div>
              <button 
                onClick={() => setShowFeedbackForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Share Your Insight
              </button>
            </div>
          </div>

          {showFeedbackForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Share Your Startup Insight</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={newFeedback.userName}
                  onChange={(e) => setNewFeedback({...newFeedback, userName: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
                
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <StarRating 
                    rating={newFeedback.rating} 
                    interactive 
                    onChange={(rating) => {
                      setNewFeedback({
                        ...newFeedback, 
                        rating,
                        reason: starReasons[rating as keyof typeof starReasons][0]
                      })
                    }} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Why {newFeedback.rating} stars?</label>
                  <select
                    value={newFeedback.reason}
                    onChange={(e) => setNewFeedback({...newFeedback, reason: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    {starReasons[newFeedback.rating as keyof typeof starReasons].map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                <textarea
                  placeholder="Share your detailed analysis and insights about this startup..."
                  value={newFeedback.description}
                  onChange={(e) => setNewFeedback({...newFeedback, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 h-24"
                />

                <div className="flex space-x-3">
                  <button 
                    onClick={addFeedback}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Submit Insight
                  </button>
                  <button 
                    onClick={() => setShowFeedbackForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {productFeedbacks.map(feedback => (
              <div key={feedback.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{feedback.userName}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <StarRating rating={feedback.rating} />
                      <span className="text-sm text-gray-500">• {feedback.reason}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {feedback.timestamp.toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{feedback.description}</p>
                
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => updateFeedbackVotes(feedback.id, 'upvote')}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{feedback.upvotes}</span>
                  </button>
                  <button 
                    onClick={() => updateFeedbackVotes(feedback.id, 'downvote')}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>{feedback.downvotes}</span>
                  </button>
                </div>
              </div>
            ))}
            
            {productFeedbacks.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No insights yet. Be the first to share your thoughts on this startup!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Startup Feedback Platform</h1>
          <p className="text-xl text-gray-600">Share your insights on promising startups and help the entrepreneurial community make informed decisions</p>
        </header>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Startups</h2>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select 
              value={startupSortBy} 
              onChange={(e) => setStartupSortBy(e.target.value as 'name' | 'rating' | 'insights' | 'newest')}
              className="border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="insights">Sort by Insights</option>
              <option value="newest">Sort by Newest</option>
            </select>
          </div>
        </div>

        {showNewProductForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Add New Startup</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Startup name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Brief description of the startup"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Emoji (optional, default: 🚀)"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />
              <div className="flex space-x-3">
                <button 
                  onClick={addProduct}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Startup
                </button>
                <button 
                  onClick={() => setShowNewProductForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditProductForm && editingProduct && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Edit Startup</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Startup name"
                value={editProduct.name}
                onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Brief description of the startup"
                value={editProduct.description}
                onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Emoji (optional, default: 🚀)"
                value={editProduct.image}
                onChange={(e) => setEditProduct({...editProduct, image: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />
              <div className="flex space-x-3">
                <button 
                  onClick={saveEditProduct}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button 
                  onClick={cancelEditProduct}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getSortedProducts().map(product => {
            const productFeedbackCount = feedbacks.filter(f => f.productId === product.id).length
            const avgRating = feedbacks.filter(f => f.productId === product.id)
              .reduce((acc, f) => acc + f.rating, 0) / Math.max(productFeedbackCount, 1)

            return (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow relative group"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    startEditProduct(product)
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                  title="Edit startup"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="text-center" onClick={() => setSelectedProduct(product)}>
                  <div className="text-4xl mb-4">{product.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  
                  {productFeedbackCount > 0 ? (
                    <div className="flex items-center justify-center space-x-2">
                      <StarRating rating={Math.round(avgRating)} />
                      <span className="text-sm text-gray-500">
                        ({productFeedbackCount} {productFeedbackCount === 1 ? 'insight' : 'insights'})
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No insights yet</p>
                  )}
                </div>
              </div>
            )
          })}

          <div 
            onClick={() => setShowNewProductForm(true)}
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-500"
          >
            <div className="text-center">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600">Add New Startup</h3>
              <p className="text-gray-500 text-sm mt-2">Click to add a startup for community feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
