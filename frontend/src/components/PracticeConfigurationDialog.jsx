import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "./lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function PracticeConfigurationDialog({ topicId }) {
  const [randomize, setRandomize] = useState("no");
  const [timeConstraint, setTimeConstraint] = useState("no");
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedYear, setSelectedYear] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [duration, setDuration] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  const toggleYear = (year) => {
    setSelectedYear((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await axios.get(`api/topic/year?topicId=${topicId}`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });

        if (res.status === 200) {
          setAvailableYears(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchYears();
  }, [currentUser?.token, topicId]);

  const navigate = useNavigate();

  const handleStart = async () => {
    try {
      const res = await axios.post(
        `api/exam/create-practice`,
        {
          topicList: [topicId],
          yearList: selectedYear,
          numberOfQuestions: numQuestions,
          isOptionRandom: randomize !== "no" ? true : false,
          duration: duration,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      if (res.status === 200) {
        navigate(`/practice/${res.data}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer flex-1 text-sm font-semibold bg-purple-800 hover:bg-purple-900 text-white rounded-md shadow-sm transition duration-150 ease-in-out">
          Practice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-lg shadow-xl p-6 bg-white dark:bg-slate-800">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Practice Configuration
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-slate-300">
            Customize your practice session settings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="numQuestions"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Number of Questions:
            </Label>
            <Input
              id="numQuestions"
              type="number"
              min="1"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
              className="dark:bg-slate-800 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
          </div>

          <div>
            <Label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Select Year:
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-full justify-between text-gray-700")}
                >
                  {selectedYear.length > 0
                    ? selectedYear.join(", ")
                    : "Select years"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-2 max-h-60 overflow-y-auto">
                {availableYears.map((year) => (
                  <div
                    key={year}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => toggleYear(year)}
                  >
                    <Checkbox
                      checked={selectedYear.includes(year)}
                      onCheckedChange={() => toggleYear(year)}
                      id={`year-${year}`}
                    />
                    <label
                      htmlFor={`year-${year}`}
                      className="text-sm font-medium leading-none"
                    >
                      {year}
                    </label>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-1 justify-between flex-col">
              <Label
                htmlFor="random"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300"
              >
                Randomize Questions?
              </Label>
              <Select
                value={randomize}
                onValueChange={(value) => setRandomize(value)}
              >
                <SelectTrigger id="random">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between flex-col flex-1">
              <Label
                htmlFor="random"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300"
              >
                Time Constraint
              </Label>
              <Select
                value={timeConstraint}
                onValueChange={(value) => setTimeConstraint(value)}
              >
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {timeConstraint !== "no" && (
            <div>
              <Label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300"
              >
                Duration:
              </Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="dark:bg-slate-800 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleStart}
            disabled={!selectedYear}
            className="inline-flex items-center rounded-md bg-purple-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 cursor-pointer"
          >
            Start Practice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PracticeConfigurationDialog;
