export default function changeToChi(status: string) {
  if (status == "apply") {
    return "申請中";
  } else if (status == "confirm") {
    return "已確認";
  } else if (status == "reject") {
    return "拒絕";
  } else if (status == "cancel") {
    return "已取消";
  } else {
    return "已完成";
  }
}

export function dhm(due_period: number) {
  const days = Math.floor(due_period / (24 * 60 * 60 * 1000));
  return days;
}
