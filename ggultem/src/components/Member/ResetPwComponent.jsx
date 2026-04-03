import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../api/admin/MemberApi"; // 🚩 API 경로 확인하세요!
import "./ResetPwComponent.css";

const ResetPwComponent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { email } = useParams();
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // ✨ 비밀번호 유효성 검사 정규식 (영문, 숫자, 특수문자 조합 8~11자)
  const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,11}$/;

  // 비밀번호 유효성 체크 결과
  const isPwValid = pwRegex.test(newPw);
  // 비밀번호 일치 체크 결과
  const isPwMatch = newPw === confirmPw;

  // 1. URL 파라미터에서 이메일과 인증 여부를 가져옵니다.
  const verified = searchParams.get("verified") === "true";

  // 2. 비정상 접근 차단 (인증 안 하고 주소창에 쳐서 들어온 경우)
  useEffect(() => {
    if (!email || !verified) {
      alert("정상적인 접근이 아닙니다. 이메일 인증을 먼저 진행해주세요!");
      navigate("/member/findEmail");
    }
  }, [email, verified, navigate]);

  // 3. 비밀번호 변경 제출
  const handleResetSubmit = (e) => {
    e.preventDefault();

    if (!newPw || !confirmPw) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (newPw !== confirmPw) {
      alert("비밀번호가 서로 일치하지 않습니다. 다시 확인해주세요! 🍯");
      return;
    }

    // 서버로 전송 (DTO 구조: { email, pw })
    resetPassword(email, newPw)
      .then((res) => {
        // 백엔드 응답 result가 true인지 확인
        if (res.result === true) {
          alert(
            "비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요! 🐝",
          );
          navigate("/login");
        } else {
          alert(res.message || "비밀번호 변경에 실패했습니다.");
        }
      })
      .catch((err) => {
        console.error("비밀번호 재설정 에러:", err);
        alert("서버와 통신 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="login-container">
      <div className="login-box reset-pw-box">
        <span className="header-logo-text">
          <span className="logo-g">G</span>꿀템
        </span>
        <h2 className="login-title">새 비밀번호 설정</h2>
        <p className="login-subtitle">
          <strong style={{ color: "#3f2e1b" }}>{email}</strong> 계정의
          <br /> 새로운 비밀번호를 입력해주세요.
        </p>

        <form className="login-form animation-up" onSubmit={handleResetSubmit}>
          <div className="input-group">
            <label>새 비밀번호</label>
            <input
              type="password"
              placeholder="영문, 숫자, 특수문자 포함 8~11자"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
            {newPw && (
              <span className={`pw-message ${isPwValid ? "success" : "error"}`}>
                {isPwValid
                  ? "사용 가능한 비밀번호입니다. ✅"
                  : "형식 불일치 (8~11자, 특수문자 포함). ❌"}
              </span>
            )}
          </div>
          <div className="input-group">
            <label>비밀번호 확인</label>
            <input
              type="password"
              placeholder="한 번 더 입력하세요"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
            />
            {confirmPw && (
              <span className={`pw-message ${isPwMatch ? "success" : "error"}`}>
                {isPwMatch
                  ? "비밀번호가 일치합니다. ✅"
                  : "비밀번호가 일치하지 않습니다. ❌"}
              </span>
            )}
          </div>

          <div style={{ marginTop: "20px" }}>
            <button type="submit" className="login-btn">
              비밀번호 변경 완료
            </button>
            <button
              type="button"
              className="white-btn-full"
              onClick={() => navigate("/login")}
              style={{ marginTop: "10px" }}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPwComponent;
