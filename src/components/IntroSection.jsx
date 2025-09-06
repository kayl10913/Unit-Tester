import React, { useState } from 'react';
import { BookOpen, MessageSquare, Sparkles, Lightbulb, HelpCircle } from 'lucide-react';
import { askAIAboutUnitTesting } from '../services/aiService.js';

const exampleQuestions = [
	"What is unit testing and why is it important?",
	"How do I choose between Jest, Mocha, and Jasmine?",
	"What are best practices for writing maintainable unit tests?",
	"How much code coverage should I aim for?",
];

const IntroSection = () => {
	const [question, setQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleAskAI = async () => {
		if (!question.trim()) return;
		setIsLoading(true);
		setAnswer('');
		try {
			const response = await askAIAboutUnitTesting(question);
			setAnswer(response);
		} catch (error) {
			setAnswer('Sorry, something went wrong while asking AI. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleUseExample = (q) => {
		setQuestion(q);
	};

	return (
		<div className="card hover-card mb-6 sm:mb-8">
			<div className="flex items-start justify-between mb-4 sm:mb-6">
				<div className="flex items-start space-x-3">
					<div className="p-2 bg-blue-500/10 rounded-lg">
						<BookOpen className="text-blue-400" size={20} />
					</div>
					<div className="min-w-0 flex-1">
						<h2 className="text-lg sm:text-xl font-semibold text-gray-100">What is Unit Testing Generator?</h2>
						<p className="text-gray-300 mt-2 leading-relaxed text-sm sm:text-base">
							The Unit Testing Generator helps you turn your source code into high-quality unit tests. It analyzes your functions and classes, suggests comprehensive test cases, and lets you run them instantly—all in one place.
						</p>
						<div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
							<span className="inline-flex items-center px-2 sm:px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
								<Lightbulb size={12} className="mr-1 sm:mr-2" />
								<span className="hidden sm:inline">Boost confidence</span>
								<span className="sm:hidden">Confidence</span>
							</span>
							<span className="inline-flex items-center px-2 sm:px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
								<Sparkles size={12} className="mr-1 sm:mr-2" />
								<span className="hidden sm:inline">AI suggestions</span>
								<span className="sm:hidden">AI</span>
							</span>
							<span className="inline-flex items-center px-2 sm:px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
								<MessageSquare size={12} className="mr-1 sm:mr-2" />
								<span className="hidden sm:inline">Actionable tips</span>
								<span className="sm:hidden">Tips</span>
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="border border-gray-600/50 rounded-xl overflow-hidden">
				<div className="bg-gray-800/50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-600/50 flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="p-2 bg-purple-500/10 rounded-lg">
							<HelpCircle className="text-purple-400" size={18} />
						</div>
						<h3 className="text-sm font-medium text-gray-300">Ask AI about unit testing</h3>
					</div>
				</div>
				<div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						<div className="lg:col-span-2">
							<textarea
								value={question}
								onChange={(e) => setQuestion(e.target.value)}
								placeholder="Ask anything about unit testing, frameworks, best practices, or coverage..."
								rows={3}
								className="input-field w-full resize-y text-sm"
							/>
						</div>
						<div className="flex flex-col gap-3">
							<button
								onClick={handleAskAI}
								disabled={!question.trim() || isLoading}
								className="btn-primary btn-hover-effect flex items-center justify-center space-x-2 text-sm"
							>
								<Sparkles size={16} />
								<span>{isLoading ? 'Asking AI...' : 'Ask AI'}</span>
							</button>
							<div className="text-xs text-gray-400">Try one of these:</div>
							<div className="flex flex-wrap gap-2">
								{exampleQuestions.map((q, i) => (
									<button
										key={i}
										onClick={() => handleUseExample(q)}
										className="px-2 sm:px-3 py-1 rounded-lg text-xs bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:bg-gray-700 transition"
									>
										<span className="hidden sm:inline">{q}</span>
										<span className="sm:hidden">{q.split(' ')[0]}...</span>
									</button>
								))}
							</div>
						</div>
					</div>

					{isLoading && (
						<div className="flex items-center justify-center py-6">
							<div className="flex items-center space-x-3">
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
								<span className="text-gray-300">Thinking<span className="loading-dots"></span></span>
							</div>
						</div>
					)}

					{answer && !isLoading && (
						<div className="mt-2 bg-gray-800/50 border border-gray-600/50 rounded-xl p-4 sm:p-5">
							<div className="flex items-center mb-3 space-x-2">
								<MessageSquare size={16} className="text-purple-400" />
								<span className="text-sm text-gray-400">AI Answer</span>
							</div>
							<p className="text-gray-200 whitespace-pre-line leading-relaxed text-sm sm:text-base">{answer}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default IntroSection;


