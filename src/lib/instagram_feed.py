import urllib.request
import json
import sys

def get_feed(username="d_bagpacker_", count=24):
    url = f"https://www.instagram.com/api/v1/feed/user/{username}/username/?count={count}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "x-ig-app-id": "936619743392459",
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            
        items = data.get("items", [])
        output = []
        for it in items:
            code = it.get("code")
            plays = it.get("play_count") if it.get("play_count") is not None else it.get("view_count")
            likes = it.get("like_count")
            comments = it.get("comment_count")
            caption = (it.get("caption") or {}).get("text", "")
            
            output.append({
                "code": code,
                "plays": plays,
                "likes": likes,
                "comments": comments,
                "caption": caption.split("\n")[0][:80] if caption else "",
                "image": (it.get("image_versions2") or {}).get("candidates", [{}])[0].get("url", ""),
                "video": (it.get("video_versions") or [{}])[0].get("url", ""),
            })
            
        print(json.dumps({"success": True, "items": output}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    user = sys.argv[1] if len(sys.argv) > 1 else "d_bagpacker_"
    get_feed(user)
