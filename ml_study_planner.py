import sys
import json
import datetime
import google.generativeai as genai

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyCUizkqkJcPZdg9UOGA0WZNeRiKvy_fypM"

try:
    genai.configure(api_key=GEMINI_API_KEY)
    llm = genai.GenerativeModel("gemini-2.0-flash")
except Exception as e:
    print(json.dumps({"error": f"Failed to initialize Gemini API: {str(e)}"}))
    sys.exit(1)

def generate_ml_study_plan(subjects_data):
    """
    Generate study plan using ML analysis of student performance
    """
    
    today = datetime.date.today()
    dates = [(today + datetime.timedelta(days=i)).strftime('%Y-%m-%d') for i in range(7)]
    
    # Build detailed prompt with all subject performance data
    subjects_info = []
    for sub in subjects_data:
        name = sub.get('name', 'Unknown')
        score = sub.get('score', 0)
        class_avg = sub.get('classAvg', 0)
        max_score = sub.get('maxScore', 0)
        
        # Calculate priority indicators
        below_avg = class_avg - score
        gap_from_max = max_score - score
        
        info_str = f"""
- Subject: {name}
  Student Score: {score}%
  Class Average: {class_avg}%
  Max Score in Class: {max_score}%
  Below Average by: {below_avg:.1f}%
  Gap from Top: {gap_from_max}%
"""
        subjects_info.append(info_str)
    
    subjects_text = "\n".join(subjects_info)
    
    prompt = f"""
You are an expert academic study planner with ML analysis capabilities. 

Today's date is {dates[0]}.

Here is the student's performance analysis across all subjects:
{subjects_text}

Based on this ML analysis, generate a personalized 7-day study plan.

PRIORITY RULES (Most Important):
1. Subjects where student is BELOW class average need MORE study time
2. Subjects with LARGE gap from max score need priority attention
3. Subjects where student is ABOVE average can have less study time
4. Balance weak and strong subjects throughout the week

TIME CONSTRAINTS (Must Follow):
1. Daily total study time MUST NOT exceed 2 hours (120 minutes)
2. Use varied durations: "30 mins", "45 mins", "1 hour", "1.5 hours"
3. Each day should have 1-2 study sessions maximum
4. Distribute across all 7 days: {', '.join(dates)}

STUDY PLAN STRUCTURE:
- High priority subjects (below average): 3-4 sessions per week
- Medium priority subjects (near average): 2-3 sessions per week  
- Low priority subjects (above average): 1-2 sessions per week
- Include varied tasks: "Review concepts", "Practice problems", "Revision", etc.
- The whole study plan must include general revision as one of study plan consists of all subjects, no need to mention each subject again.(once in 2 days))

IMPORTANT: Respond with ONLY a valid JSON object in this exact format:
{{
    "plan": [
        {{
            "date": "YYYY-MM-DD",
            "subject": "Subject Name",
            "task": "Specific task description",
            "duration": "X mins or Y hour(s)",
            "time": "HH:MM"
        }}
    ]
}}

Do NOT include any text before or after the JSON. Do NOT use markdown code blocks.
Generate times between 09:00 and 21:00.
Ensure daily total never exceeds 2 hours.
Generate the complete 7-day plan now:
"""
    
    try:
        response = llm.generate_content(prompt)
        response_text = response.text.strip()
        
        # Clean up any markdown code blocks
        response_text = response_text.replace("```json", "").replace("```", "").strip()
        
        # Parse the JSON response
        plan_data = json.loads(response_text)
        
        return plan_data
        
    except json.JSONDecodeError as e:
        return {"error": f"Invalid JSON from AI: {str(e)}", "raw": response_text}
    except Exception as e:
        return {"error": f"Error generating plan: {str(e)}"}

def main():
    try:
        # Read input from Node.js
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        
        subjects = data.get('subjects', [])
        
        if not subjects:
            print(json.dumps({"error": "No subjects provided"}))
            sys.exit(1)
        
        # Generate the plan
        result = generate_ml_study_plan(subjects)
        
        # Output the result
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": f"Python script error: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()