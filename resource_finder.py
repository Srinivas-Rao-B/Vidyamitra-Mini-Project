# resource_finder.py
import sys
import re
import google.generativeai as genai
from googleapiclient.discovery import build
import os
import codecs 

# --- FIX FOR UNICODE ENCODING ERROR ---
try:
    sys.stdin.reconfigure(encoding='utf-8') 
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
except AttributeError:
    # Fallback for older Python versions or environments
    sys.stdin = codecs.getreader('utf-8')(sys.stdin.buffer)
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer)
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer)
# --- END OF FIX ---


# --- CONFIGURATION ---
GEMINI_API_KEY = "YOUR_API_KEY" 
YOUTUBE_API_KEY = "YOUR_YT_API_HERE"

try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.0-flash") 
    youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
except Exception as e:
    print("###SUMMARY###")
    print(f"PYTHON_SCRIPT_ERROR: Failed to initialize APIs. Check server logs. Error: {e}")
    print("###WEBSITES###\n###TEXTBOOKS###\n###YOUTUBE###")
    sys.exit(0)

# --- HELPER FUNCTIONS ---
def get_clean_text(text):
    text = re.sub(r"\*\*|[*_`]", "", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\n\s*\n", "\n", text)
    text = re.sub(r"•", "-", text)
    return text.strip()

def get_youtube_links(topic, max_results=3):
    try:
        query = f"{topic} tutorial data structures algorithms explanation"
        response = youtube.search().list(
            q=query,
            part="snippet",
            type="video",
            maxResults=max_results,
            order="relevance",
            relevanceLanguage="en",
            safeSearch="strict"
        ).execute()
        
        results = []
        for item in response.get("items", []):
            title = item["snippet"]["title"]
            video_id = item["id"]["videoId"]
            link = f"https://www.youtube.com/watch?v={video_id}"
            results.append({"title": title, "link": link})
        return results
    except Exception as e:
        return [{"title": f"YouTube API Error: {e}", "link": "#"}]

def get_gemini_resources(topic):
    
    # ✅ --- KEY CHANGE ---
    # The prompt now demands a specific format for websites
    prompt = f"""
    Generate a study guide for the topic: "{topic}".
    Follow this structure exactly:
    
    ###SUMMARY###
    [Provide a concise, one-paragraph summary of the topic.]

    ###WEBSITES###
    (Provide the top 3 *specific* web pages. You MUST use the format: 1. [Title]: [Description] (https://link.com))
    1. [Page Title]: [Brief description] (https://website.com/specific-page)
    2. [Page Title]: [Brief description] (https://website.com/another-page)
    3. [Page Title]: [Brief description] (https://another-site.org/topic-guide)

    ###TEXTBOOKS###
    (List top 3 relevant textbooks as a simple list.)
    1. [Textbook Title] by [Author]: [Brief description]
    2. [Textbook Title] by [Author]: [Brief description]
    3. [Textbook Title] by [Author]: [Brief description]
    """
    
    try:
        response = model.generate_content(prompt)
        if not response.text:
            raise Exception("Gemini returned an empty response.")
        return get_clean_text(response.text)
    except Exception as e:
        error_message = f"GEMINI_API_ERROR: {e}. Check your API key, billing, and regional availability."
        return f"###SUMMARY###\n{error_message}\n###WEBSITES###\n###TEXTBOOKS###"

# --- MAIN EXECUTION ---
def main():
    topic = sys.stdin.readline().strip()
    
    if not topic:
        print("###SUMMARY###\nNo topic provided.\n###WEBSITES###\n###TEXTBOOKS###\n###YOUTUBE###")
        sys.exit(0)

    # 1. Get Gemini Resources
    gemini_output = get_gemini_resources(topic)
    print(gemini_output) 

    # 2. Get YouTube Links
    yt_links = get_youtube_links(topic)
    
    print("\n###YOUTUBE###")
    if yt_links:
        for item in yt_links:
            print(f"{item['title']} || {item['link']}")
    else:
        print("No relevant YouTube videos found.")

if __name__ == "__main__":

    main()

